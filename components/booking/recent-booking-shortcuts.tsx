import { History } from "lucide-react";
import type { RecentBookingShortcut } from "@/lib/booking/service-picker-helpers";

export function RecentBookingShortcuts({
  bookings,
  onSelect,
}: {
  bookings: RecentBookingShortcut[];
  onSelect: (href: string) => void;
}) {
  if (bookings.length === 0) return null;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="h-4 w-4 text-primary" />
          Book again
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Repeat a recent visit with the same worker and service
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <button
            key={booking.id}
            type="button"
            onClick={() => onSelect(booking.href)}
            className="rounded-2xl border border-border/70 bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <p className="font-semibold text-sm">{booking.serviceLabel}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {booking.workerName ? `with ${booking.workerName}` : "Same service setup"}
            </p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              {booking.bookingCode}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
