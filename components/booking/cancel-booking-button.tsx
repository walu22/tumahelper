"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CancelBookingButtonProps {
  bookingId: string;
}

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || undefined }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message || "Failed to cancel booking");
        return;
      }

      window.location.reload();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        Cancel Booking
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-destructive">
        Are you sure you want to cancel this booking?
      </p>
      <Textarea
        placeholder="Reason for cancellation (optional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setOpen(false)}
          disabled={loading}
        >
          Keep Booking
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={handleCancel}
          disabled={loading}
        >
          {loading ? "Cancelling..." : "Confirm Cancel"}
        </Button>
      </div>
    </div>
  );
}
