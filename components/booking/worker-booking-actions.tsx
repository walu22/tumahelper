"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { BookingStatus } from "@/types";

const STATUS_ACTIONS: Partial<
  Record<
    BookingStatus,
    {
      label: string;
      action: BookingStatus;
      icon: typeof CheckCircle;
      variant: "default" | "outline";
    }[]
  >
> = {
  pending: [
    {
      label: "Accept Booking",
      action: "accepted",
      icon: CheckCircle,
      variant: "default",
    },
    { label: "Decline", action: "declined", icon: XCircle, variant: "outline" },
  ],
  accepted: [
    { label: "Start Job", action: "in_progress", icon: Play, variant: "default" },
  ],
  in_progress: [
    {
      label: "Complete Job",
      action: "completed",
      icon: CheckCircle,
      variant: "default",
    },
  ],
};

export function WorkerBookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const actions = STATUS_ACTIONS[status] ?? [];

  if (actions.length === 0) return null;

  async function updateStatus(newStatus: BookingStatus) {
    setLoading(newStatus);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update booking");
      }

      toast.success(`Booking ${newStatus.replace("_", " ")}`);
      router.refresh();

      if (newStatus === "declined" || newStatus === "completed") {
        router.push("/worker/bookings");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button
          key={action.action}
          variant={action.variant}
          className="gap-2"
          disabled={!!loading}
          onClick={() => updateStatus(action.action)}
        >
          {loading === action.action ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <action.icon className="w-4 h-4" />
          )}
          {action.label}
        </Button>
      ))}
    </div>
  );
}
