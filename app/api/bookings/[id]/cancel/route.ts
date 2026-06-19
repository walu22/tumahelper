import { NextRequest } from "next/server";
import { createAuthenticatedRouteHandlerClient } from "@/lib/supabase-server";
import { requireAuth, successResponse, errorResponse, createNotification } from "@/lib/auth";
import { z } from "zod";

const cancelSchema = z.object({
  reason: z.string().max(500).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;
    const body = await request.json();
    const { reason } = cancelSchema.parse(body);

    const supabase = createAuthenticatedRouteHandlerClient();

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (!booking) {
      return errorResponse("NOT_FOUND", "Booking not found", 404);
    }

    if (user.id !== booking.customer_id && user.id !== booking.worker_id) {
      return errorResponse("FORBIDDEN", "Access denied", 403);
    }

    if (["completed", "cancelled", "disputed"].includes(booking.status)) {
      return errorResponse("INVALID_STATUS", "Cannot cancel this booking", 400);
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancellation_reason: reason,
        cancelled_by: user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    const notifyUserId =
      user.id === booking.customer_id ? booking.worker_id : booking.customer_id;
    const cancelledBy =
      user.id === booking.customer_id ? "The customer" : "Your worker";

    await createNotification({
      userId: notifyUserId,
      type: "booking_cancelled",
      title: "Booking cancelled",
      message: `${cancelledBy} cancelled the booking scheduled for ${booking.service_date}.`,
      data: { bookingId: id },
    });

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to cancel booking", 500);
  }
}
