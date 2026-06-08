import { NextRequest } from "next/server";
import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import { requireAuth, successResponse, errorResponse } from "@/lib/auth";
import { bookingStatusSchema } from "@/lib/validations";
import { calculateTrustScore } from "@/lib/trust-score";

const validTransitions: Record<string, string[]> = {
  pending: ["accepted", "declined", "cancelled"],
  accepted: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  declined: [],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;
    const body = await request.json();
    const { status, reason } = bookingStatusSchema.parse(body);

    const supabase = getRouteHandlerClient();
    const adminClient = getAdminClient();

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (!booking) {
      return errorResponse("NOT_FOUND", "Booking not found", 404);
    }

    const isCustomer = user.id === booking.customer_id;
    const isWorker = user.id === booking.worker_id;
    const isAdmin = user.role === "admin";

    if (!isCustomer && !isWorker && !isAdmin) {
      return errorResponse("FORBIDDEN", "Access denied", 403);
    }

    const allowedTransitions = validTransitions[booking.status] || [];
    if (!allowedTransitions.includes(status)) {
      return errorResponse(
        "INVALID_TRANSITION",
        `Cannot transition from ${booking.status} to ${status}`,
        400
      );
    }

    if (isWorker && !["accepted", "declined", "in_progress", "completed"].includes(status)) {
      return errorResponse("FORBIDDEN", "Worker cannot perform this action", 403);
    }

    if (isCustomer && status !== "cancelled") {
      return errorResponse("FORBIDDEN", "Customer can only cancel bookings", 403);
    }

    const updateData: Record<string, unknown> = { status };
    if (status === "cancelled") {
      updateData.cancellation_reason = reason;
      updateData.cancelled_by = user.id;
    }

    const { data: updated, error } = await adminClient
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    if (status === "completed") {
      const { data: profile } = await adminClient
        .from("worker_profiles")
        .select("*")
        .eq("user_id", booking.worker_id)
        .single();

      if (profile) {
        const { data: bookings } = await adminClient
          .from("bookings")
          .select("*")
          .eq("worker_id", booking.worker_id);

        const { data: reviews } = await adminClient
          .from("reviews")
          .select("*")
          .eq("reviewee_id", booking.worker_id);

        const { data: disputes } = await adminClient
          .from("disputes")
          .select("*")
          .eq("against_user_id", booking.worker_id)
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
            total_jobs_completed: (bookings || []).filter((b) => b.status === "completed").length,
          })
          .eq("user_id", booking.worker_id);
      }
    }

    const notifyUserId = isWorker ? booking.customer_id : booking.worker_id;
    await adminClient.from("notifications").insert({
      user_id: notifyUserId,
      type: `booking_${status}`,
      title: `Booking ${status}`,
      message: `Your booking has been ${status}`,
      data: { bookingId: id },
    });

    return successResponse(updated);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid status", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to update status", 500);
  }
}
