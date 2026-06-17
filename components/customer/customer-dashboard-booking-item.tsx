import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookAgainLink } from "@/components/booking/book-again-link";
import { formatCurrency } from "@/utils/formatters";
import { formatDate, formatTime } from "@/utils/formatters";
import { formatPaymentStatusLabel } from "@/lib/bookings/display-labels";
import { ArrowRight, Clock, MapPin, User } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
};

const statusVariants: Record<
  string,
  "warning" | "info" | "success" | "destructive" | "secondary"
> = {
  pending: "warning",
  accepted: "info",
  in_progress: "info",
  completed: "success",
  cancelled: "destructive",
  declined: "destructive",
};

interface CustomerDashboardBookingItemProps {
  booking: {
    id: string;
    booking_code: string;
    status: string;
    service_date: string;
    service_time: string;
    location_address: string;
    amount: number;
    platform_fee?: number;
    payment_status: string;
    worker?: { full_name?: string | null } | null;
  };
  highlight?: boolean;
  bookAgainHref?: string | null;
}

export function CustomerDashboardBookingItem({
  booking,
  highlight = false,
  bookAgainHref = null,
}: CustomerDashboardBookingItemProps) {
  const total =
    booking.amount + (booking.platform_fee ?? Math.round(booking.amount * 0.1));

  return (
    <div
      className={`rounded-2xl border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md ${
        highlight ? "border-amber-200 bg-amber-50/40" : "border-border"
      }`}
    >
      <Link
        href={`/customer/bookings/${booking.id}`}
        className="group block p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">
                {booking.booking_code}
              </span>
              <Badge
                variant={statusVariants[booking.status] || "secondary"}
                className="text-xs capitalize"
              >
                {statusLabels[booking.status] || booking.status.replace("_", " ")}
              </Badge>
              {highlight && (
                <Badge variant="warning" className="text-xs">
                  Action needed
                </Badge>
              )}
            </div>

            {booking.worker?.full_name && (
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary shrink-0" />
                {booking.worker.full_name}
              </p>
            )}

            <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                {formatDate(booking.service_date)} at {formatTime(booking.service_time)}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{booking.location_address}</span>
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="font-display text-lg font-bold text-foreground">
              {formatCurrency(total)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatPaymentStatusLabel(booking.payment_status)}
            </p>
            <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Link>

      {bookAgainHref && (
        <div className="px-4 pb-4 pt-0 border-t border-border/60 mx-4 mb-4 mt-1 pt-3">
          <BookAgainLink
            href={bookAgainHref}
            workerName={booking.worker?.full_name}
            className="w-full"
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
