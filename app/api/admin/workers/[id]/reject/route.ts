import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;

    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("worker_profiles")
      .update({
        verification_status: "rejected",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    await adminClient.from("audit_logs").insert({
      admin_id: admin.id,
      action: "worker_rejected",
      entity_type: "worker",
      entity_id: id,
    });

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to reject worker", 500);
  }
}
