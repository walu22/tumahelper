import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";
import { recalculateTrustScore } from "@/lib/trust-score";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;

    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("verification_documents")
      .update({
        status: "approved",
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    const { data: pendingDocs } = await adminClient
      .from("verification_documents")
      .select("id")
      .eq("worker_id", data.worker_id)
      .eq("status", "submitted");

    if (!pendingDocs || pendingDocs.length === 0) {
      const { data: worker } = await adminClient
        .from("worker_profiles")
        .select("verification_level")
        .eq("user_id", data.worker_id)
        .single();

      const levels = ["none", "bronze", "silver", "gold", "platinum"];
      const currentIndex = levels.indexOf(worker?.verification_level || "none");

      await adminClient
        .from("worker_profiles")
        .update({
          verification_level: levels[Math.min(currentIndex + 1, 3)],
          verification_status: "approved",
        })
        .eq("user_id", data.worker_id);

      await recalculateTrustScore(data.worker_id, "verification_changed");
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to approve document", 500);
  }
}
