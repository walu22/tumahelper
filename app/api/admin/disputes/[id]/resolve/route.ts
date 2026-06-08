import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse } from "@/lib/auth";
import { resolveDisputeSchema } from "@/lib/validations";
import { calculateTrustScore } from "@/lib/trust-score";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;
    const body = await request.json();
    const { resolution, resolutionAction, refundAmount } = resolveDisputeSchema.parse(body);

    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("disputes")
      .update({
        status: "resolved",
        resolution,
        resolution_action: resolutionAction,
        refund_amount: refundAmount,
        resolved_by: admin.id,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    if (resolutionAction === "worker_suspension") {
      await adminClient
        .from("users")
        .update({ status: "suspended" })
        .eq("id", data.against_user_id);
    } else if (resolutionAction === "account_ban") {
      await adminClient
        .from("users")
        .update({ status: "rejected" })
        .eq("id", data.against_user_id);
    }

    const { data: profile } = await adminClient
      .from("worker_profiles")
      .select("*")
      .eq("user_id", data.against_user_id)
      .single();

    if (profile) {
      const { data: bookings } = await adminClient
        .from("bookings")
        .select("*")
        .eq("worker_id", data.against_user_id);

      const { data: reviews } = await adminClient
        .from("reviews")
        .select("*")
        .eq("reviewee_id", data.against_user_id);

      const { data: disputes } = await adminClient
        .from("disputes")
        .select("*")
        .eq("against_user_id", data.against_user_id)
        .eq("status", "resolved");

      const trustResult = calculateTrustScore(
        profile,
        bookings || [],
        reviews || [],
        disputes || []
      );

      await adminClient
        .from("worker_profiles")
        .update({
          trust_score: trustResult.score,
          trust_score_components: trustResult.components,
        })
        .eq("user_id", data.against_user_id);
    }

    await adminClient.from("audit_logs").insert({
      admin_id: admin.id,
      action: "dispute_resolved",
      entity_type: "dispute",
      entity_id: id,
      new_value: { resolution, resolutionAction, refundAmount },
    });

    await adminClient.from("notifications").insert([
      {
        user_id: data.raised_by,
        type: "dispute_resolved",
        title: "Dispute Resolved",
        message: `Your dispute has been resolved: ${resolution}`,
        data: { disputeId: id },
      },
      {
        user_id: data.against_user_id,
        type: "dispute_resolved",
        title: "Dispute Resolved",
        message: `A dispute against you has been resolved: ${resolution}`,
        data: { disputeId: id },
      },
    ]);

    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid resolution data", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to resolve dispute", 500);
  }
}
