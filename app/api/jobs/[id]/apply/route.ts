import { NextRequest } from "next/server";
import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import { requireRole, successResponse, errorResponse } from "@/lib/auth";
import { jobApplicationSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole("worker");
    const { id } = params;
    const body = await request.json();
    const validated = jobApplicationSchema.parse(body);

    const supabase = getRouteHandlerClient();
    const adminClient = getAdminClient();

    const { data: job } = await supabase
      .from("job_posts")
      .select("*")
      .eq("id", id)
      .eq("status", "open")
      .single();

    if (!job) {
      return errorResponse("NOT_FOUND", "Job not found or closed", 404);
    }

    const { data: worker } = await supabase
      .from("worker_profiles")
      .select("verification_level")
      .eq("user_id", user.id)
      .single();

    const verificationLevels = ["none", "bronze", "silver", "gold", "platinum"];
    const workerLevel = verificationLevels.indexOf(worker?.verification_level || "none");
    const requiredLevel = verificationLevels.indexOf(job.required_verification_level);

    if (workerLevel < requiredLevel) {
      return errorResponse("INSUFFICIENT_VERIFICATION", "Does not meet required verification level", 400);
    }

    const { data: existing } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", id)
      .eq("worker_id", user.id)
      .single();

    if (existing) {
      return errorResponse("ALREADY_APPLIED", "Already applied to this job", 400);
    }

    const { data, error } = await adminClient
      .from("job_applications")
      .insert({
        job_id: id,
        worker_id: user.id,
        cover_note: validated.coverNote,
        expected_salary: validated.expectedSalary,
      })
      .select()
      .single();

    if (error) {
      return errorResponse("APPLY_FAILED", error.message, 500);
    }

    await adminClient.rpc("increment_job_applications", { job_id: id });

    await adminClient.from("notifications").insert({
      user_id: job.employer_id,
      type: "job_application",
      title: "New Application",
      message: "Someone applied to your job post",
      data: { jobId: id, applicationId: data.id },
    });

    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid application data", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to apply", 500);
  }
}
