import { NextRequest } from "next/server";
import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import { requireRole, successResponse, errorResponse } from "@/lib/auth";
import { z } from "zod";

const hireSchema = z.object({
  workerId: z.string().uuid(),
  salary: z.number().min(0),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole("employer");
    const { id } = params;
    const body = await request.json();
    const { workerId, salary } = hireSchema.parse(body);

    const supabase = getRouteHandlerClient();
    const adminClient = getAdminClient();

    const { data: job } = await supabase
      .from("job_posts")
      .select("*")
      .eq("id", id)
      .eq("employer_id", user.id)
      .single();

    if (!job) {
      return errorResponse("NOT_FOUND", "Job not found", 404);
    }

    const { data: application } = await adminClient
      .from("job_applications")
      .update({
        status: "hired",
        offer_salary: salary,
        hired_at: new Date().toISOString(),
      })
      .eq("job_id", id)
      .eq("worker_id", workerId)
      .select()
      .single();

    if (!application) {
      return errorResponse("NOT_FOUND", "Application not found", 404);
    }

    await adminClient
      .from("job_posts")
      .update({
        status: "filled",
        hired_worker_id: workerId,
      })
      .eq("id", id);

    return successResponse(application);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to hire", 500);
  }
}
