"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, CreditCard, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminEmptyState } from "@/components/admin/admin-page-section";
import type { AdminPaymentRow } from "@/lib/admin/list-data";
import { formatAdminLabel, paymentRecordStatusVariant } from "@/lib/admin/status-badges";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

function canReviewPayment(status: string) {
  return status === "pending" || status === "paid";
}

export function AdminPaymentsTable({ payments }: { payments: AdminPaymentRow[] }) {
  const router = useRouter();

  async function handleConfirm(payment: AdminPaymentRow) {
    const targetId = payment.booking_id || payment.id;
    const res = await fetch(`/api/admin/payments/${targetId}/confirm`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: "Confirmed from admin panel" }),
    });
    const json = await res.json();

    if (json.success) {
      toast.success("Payment confirmed");
      router.refresh();
      return;
    }

    toast.error(json.error?.message || json.error || "Failed to confirm payment");
  }

  async function handleReject(payment: AdminPaymentRow) {
    const res = await fetch(`/api/admin/payments/${payment.id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Rejected by admin" }),
    });
    const json = await res.json();

    if (json.success) {
      toast.success("Payment rejected");
      router.refresh();
      return;
    }

    toast.error(json.error?.message || json.error || "Failed to reject payment");
  }

  if (payments.length === 0) {
    return (
      <AdminEmptyState
        icon={CreditCard}
        title="No payments recorded yet"
        description="Customer payment proofs will appear here once bookings are submitted."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/70 text-left text-muted-foreground">
            <th className="pb-3 pr-3 font-medium">Code</th>
            <th className="pb-3 pr-3 font-medium">Type</th>
            <th className="pb-3 pr-3 font-medium">Amount</th>
            <th className="pb-3 pr-3 font-medium">Fee</th>
            <th className="pb-3 pr-3 font-medium">Status</th>
            <th className="pb-3 pr-3 font-medium">Submitted</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-border/50 last:border-0">
              <td className="py-3 pr-3 font-mono text-xs">{payment.payment_code}</td>
              <td className="py-3 pr-3 capitalize">{formatAdminLabel(payment.payment_type)}</td>
              <td className="py-3 pr-3 whitespace-nowrap">{formatCurrency(payment.amount)}</td>
              <td className="py-3 pr-3 whitespace-nowrap">{formatCurrency(payment.platform_fee)}</td>
              <td className="py-3 pr-3">
                <Badge variant={paymentRecordStatusVariant(payment.status)}>
                  {formatAdminLabel(payment.status)}
                </Badge>
              </td>
              <td className="py-3 pr-3 whitespace-nowrap text-muted-foreground">
                {new Date(payment.created_at).toLocaleDateString("en-ZM")}
              </td>
              <td className="py-3">
                {canReviewPayment(payment.status) ? (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-green-600 hover:text-green-700"
                      onClick={() => handleConfirm(payment)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Confirm payment</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-red-600 hover:text-red-700"
                      onClick={() => handleReject(payment)}
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="sr-only">Reject payment</span>
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
