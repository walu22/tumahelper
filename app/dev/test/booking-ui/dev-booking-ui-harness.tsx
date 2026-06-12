"use client";

import { useState } from "react";
import type { BookingStatus } from "@/types";
import { WorkerBookingActions } from "@/components/booking/worker-booking-actions";
import { PaymentInstructions } from "@/components/booking/payment-instructions";

const TEST_BOOKING_ID = "c0000000-0000-0000-0000-000000000010";

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
    </>
  );
}
