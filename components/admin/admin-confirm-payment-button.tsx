"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AdminConfirmPaymentButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${bookingId}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Confirmed from admin booking detail" }),
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || json.error || "Failed to confirm payment");
      }

      toast.success("Payment confirmed");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      className="w-full rounded-full"
      onClick={handleConfirm}
      disabled={loading}
      data-testid="admin-confirm-payment"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      Confirm payment
    </Button>
  );
}
