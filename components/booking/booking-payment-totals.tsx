"use client";

import { formatCurrency } from "@/lib/utils";

interface BookingPaymentTotalsProps {
  amountInCents: number;
  platformFee: number;
  totalCents: number;
}

export function BookingPaymentTotals({
  amountInCents,
  platformFee,
  totalCents,
}: BookingPaymentTotalsProps) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 divide-y divide-border">
      <div className="flex justify-between px-4 py-3 text-sm">
        <span className="text-muted-foreground">Service fee</span>
        <span className="font-medium">{formatCurrency(amountInCents)}</span>
      </div>
      <div className="flex justify-between px-4 py-3 text-sm">
        <span className="text-muted-foreground">Platform fee (10%)</span>
        <span className="font-medium">{formatCurrency(platformFee)}</span>
      </div>
      <div className="flex justify-between px-4 py-3 text-sm font-semibold bg-white rounded-b-xl">
        <span>Total to pay</span>
        <span className="text-primary">{formatCurrency(totalCents)}</span>
      </div>
    </div>
  );
}
