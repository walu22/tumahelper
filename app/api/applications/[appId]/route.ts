import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { requireAuth, successResponse, errorResponse } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["shortlisted", "interview_scheduled", "offered", "rejected"]),
  interviewDate: z.string().optional(),
  interviewLocation: z.string().optional(),
  offerSalary: z.number().optional(),
  rejectionReason: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { appId: string } }
) {
  try {
    const user = await requireAuth();
    const { appId } = params;
    const body = await request.json();
    const validated = updateSchema.parse(body);

    const supabase = getRouteHandlerClient();

    const { data: application } = await supabase
      .from("job_applications")
      .select(`
        *,
        job:job_id(employer_id)
      `)
      .eq("id", appId)
      .single();

    if (!application) {
      return errorResponse("NOT_FOUND", "Application not found", 404);
    }

    if (user.id !== application.job.employer_id && user.role !== "admin") {
      return errorResponse("FORBIDDEN", "Access denied", 403);
    }

    const updateData: Record<string, unknown> = { status: validated.status };
    if (validated.interviewDate) updateData.interview_date = validated.interviewDate;
    if (validated.interviewLocation) updateData.interview_location = validated.interviewLocation;
    if (validated.offerSalary) updateData.offer_salary = validated.offerSalary;
    if (validated.rejectionReason) updateData.rejection_reason = validated.rejectionReason;

    const { data, error } = await supabase
      .from("job_applications")
      .update(updateData)
      .eq("id", appId)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to update application", 500);
  }
}
