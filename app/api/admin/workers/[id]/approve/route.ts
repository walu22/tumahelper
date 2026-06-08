import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";
import { approveWorkerSchema } from "@/lib/validations";
import { recalculateTrustScore } from "@/lib/trust-score";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;
    const body = await request.json();
    const { verificationLevel } = approveWorkerSchema.parse(body);

    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("worker_profiles")
      .update({
        verification_level: verificationLevel,
        verification_status: "approved",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    await adminClient.from("audit_logs").insert({
      admin_id: admin.id,
      action: "worker_approved",
      entity_type: "worker",
      entity_id: id,
      new_value: { verification_level: verificationLevel },
    });

    await adminClient.from("notifications").insert({
      user_id: data.user_id,
      type: "verification_approved",
      title: "Verification Approved",
      message: `Your verification has been approved. You are now ${verificationLevel} verified.`,
      data: { verificationLevel },
    });

    await recalculateTrustScore(data.user_id, "verification_changed");

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to approve worker", 500);
  }
}
