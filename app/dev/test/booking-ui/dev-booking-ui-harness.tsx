"use client";

import { useState } from "react";
import type { BookingStatus } from "@/types";
import { AdminPaymentsTable } from "@/components/admin/admin-payments-table";
import { WorkerBookingActions } from "@/components/booking/worker-booking-actions";
import { PaymentInstructions } from "@/components/booking/payment-instructions";
import type { AdminPaymentRow } from "@/lib/admin/list-data";

const TEST_BOOKING_ID = "c0000000-0000-0000-0000-000000000010";

const MOCK_PENDING_PAYMENT: AdminPaymentRow = {
  id: "p0000000-0000-0000-0000-000000000001",
  payment_code: "PAY-TEST01",
  booking_id: TEST_BOOKING_ID,
  payment_type: "booking",
  amount: 38500,
  platform_fee: 3850,
  status: "pending",
  created_at: "2026-06-01T12:00:00.000Z",
};

export function DevBookingUiHarness() {
  const [liveStatus, setLiveStatus] = useState<BookingStatus>("pending");

  return (
    <>
      <section data-testid="actions-live" className="space-y-3 rounded-xl border p-6">
        <h2 className="font-semibold">Interactive worker flow</h2>
        <p className="text-sm text-muted-foreground">Status: {liveStatus.replace("_", " ")}</p>
        <WorkerBookingActions
          bookingId={TEST_BOOKING_ID}
          status={liveStatus}
          onStatusChange={setLiveStatus}
        />
      </section>

      <section data-testid="actions-pending" className="space-y-3 rounded-xl border p-6">
        <h2 className="font-semibold">Pending actions</h2>
        <WorkerBookingActions bookingId={TEST_BOOKING_ID} status="pending" />
      </section>

      <section data-testid="actions-accepted" className="space-y-3 rounded-xl border p-6">
        <h2 className="font-semibold">Accepted actions</h2>
        <WorkerBookingActions bookingId={TEST_BOOKING_ID} status="accepted" />
      </section>

      <section data-testid="actions-in-progress" className="space-y-3 rounded-xl border p-6">
        <h2 className="font-semibold">In progress actions</h2>
        <WorkerBookingActions bookingId={TEST_BOOKING_ID} status="in_progress" />
      </section>

      <section data-testid="payment-pending" className="rounded-xl border p-6">
        <PaymentInstructions
          bookingId={TEST_BOOKING_ID}
          totalAmount={38500}
          paymentStatus="pending"
        />
      </section>

      <section data-testid="admin-payment-review" className="rounded-xl border p-6">
        <h2 className="mb-4 font-semibold">Admin payment review</h2>
        <AdminPaymentsTable payments={[MOCK_PENDING_PAYMENT]} />
      </section>
    </>
  );
}
