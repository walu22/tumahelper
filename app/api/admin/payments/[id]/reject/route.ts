import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireAdmin, createNotification } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const { reason } = await request.json();
    const adminClient = getAdminClient();

    const { data: payment, error: fetchError } = await adminClient
      .from("payments")
      .select("id, booking_id, payer_id")
      .eq("id", params.id)
      .single();

    if (fetchError || !payment) {
      throw fetchError ?? new Error("Payment not found");
    }

    const { error } = await adminClient
      .from("payments")
      .update({
        status: "failed",
        notes: reason,
      })
      .eq("id", params.id);

    if (error) throw error;

    if (payment.booking_id) {
      const { data: booking } = await adminClient
        .from("bookings")
        .update({
          payment_status: "pending",
          payment_proof_url: null,
        })
        .eq("id", payment.booking_id)
        .select("booking_code")
        .single();

      if (payment.payer_id) {
        await createNotification({
          userId: payment.payer_id,
          type: "payment_rejected",
          title: "Payment proof rejected",
          message: booking
            ? `Please upload a valid payment proof for booking ${booking.booking_code}.`
            : "Please upload a valid payment proof for your booking.",
          data: { bookingId: payment.booking_id },
        });
      }
    }

    await adminClient.from("audit_logs").insert({
      admin_id: admin.id,
      action: "payment_rejected",
      entity_type: "payment",
      entity_id: params.id,
      new_value: { status: "failed", reason },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === "Forbidden" ? 403 : 500 }
    );
  }
}
