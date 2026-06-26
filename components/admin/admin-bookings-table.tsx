import Link from "next/link";
import { CalendarCheck, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminEmptyState } from "@/components/admin/admin-page-section";
import type { AdminBookingRow } from "@/lib/admin/list-data";
import {
  bookingStatusVariant,
  formatAdminLabel,
  paymentStatusVariant,
} from "@/lib/admin/status-badges";
import { formatCurrency } from "@/lib/utils";

export function AdminBookingsTable({ bookings }: { bookings: AdminBookingRow[] }) {
  if (bookings.length === 0) {
    return (
      <AdminEmptyState
        icon={CalendarCheck}
        title="No bookings yet"
        description="New customer bookings will show up here once Supabase is connected."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/70 text-left text-muted-foreground">
            <th className="pb-3 pr-3 font-medium">Code</th>
            <th className="pb-3 pr-3 font-medium">Date</th>
            <th className="pb-3 pr-3 font-medium">Location</th>
            <th className="pb-3 pr-3 font-medium">Amount</th>
            <th className="pb-3 pr-3 font-medium">Status</th>
            <th className="pb-3 pr-3 font-medium">Payment</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-border/50 last:border-0">
              <td className="py-3 pr-3 font-mono text-xs">{booking.booking_code}</td>
              <td className="py-3 pr-3 whitespace-nowrap">
                <div>{new Date(booking.service_date).toLocaleDateString("en-ZM")}</div>
                {booking.service_time ? (
                  <div className="text-xs text-muted-foreground">{booking.service_time}</div>
                ) : null}
              </td>
              <td className="max-w-[12rem] truncate py-3 pr-3 text-muted-foreground">
                {booking.location_address || "—"}
              </td>
              <td className="py-3 pr-3 whitespace-nowrap">{formatCurrency(booking.amount)}</td>
              <td className="py-3 pr-3">
                <Badge variant={bookingStatusVariant(booking.status)}>
                  {formatAdminLabel(booking.status)}
                </Badge>
              </td>
              <td className="py-3 pr-3">
                <Badge variant={paymentStatusVariant(booking.payment_status)}>
                  {formatAdminLabel(booking.payment_status)}
                </Badge>
              </td>
              <td className="py-3">
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View booking</span>
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
