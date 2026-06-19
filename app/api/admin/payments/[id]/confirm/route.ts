import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, successResponse, errorResponse, createNotification } from "@/lib/auth";
import { confirmPaymentSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { id } = params;
    const body = await request.json();
    const { notes } = confirmPaymentSchema.parse(body);

    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("bookings")
      .update({
        payment_status: "confirmed",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return errorResponse("UPDATE_FAILED", error.message, 500);
    }

    await adminClient.from("payments").insert({
      payment_code: `PAY-${Date.now()}`,
      booking_id: id,
      payer_id: data.customer_id,
      payee_id: data.worker_id,
      amount: data.amount,
      platform_fee: data.platform_fee,
      payment_type: "booking",
      status: "confirmed",
      confirmed_by: admin.id,
      confirmed_at: new Date().toISOString(),
      notes,
    });

    await adminClient.from("audit_logs").insert({
      admin_id: admin.id,
      action: "payment_confirmed",
      entity_type: "booking",
      entity_id: id,
      new_value: { payment_status: "confirmed" },
    });

    await createNotification({
      userId: data.customer_id,
      type: "payment_confirmed",
      title: "Payment confirmed",
      message: `Your payment for booking ${data.booking_code} has been confirmed.`,
      data: { bookingId: id },
    });

    if (data.worker_id) {
      await createNotification({
        userId: data.worker_id,
        type: "payment_received",
        title: "Payment confirmed",
        message: `Payment for booking ${data.booking_code} was confirmed. You can proceed with the visit.`,
        data: { bookingId: id },
      });
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to confirm payment", 500);
  }
}
