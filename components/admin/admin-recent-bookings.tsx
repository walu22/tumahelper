import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminRecentBooking } from "@/lib/admin/dashboard-data";
import {
  bookingStatusVariant,
  formatAdminLabel,
  paymentStatusVariant,
} from "@/lib/admin/status-badges";
import { formatCurrency } from "@/lib/utils";

export function AdminRecentBookingsTable({
  bookings,
}: {
  bookings: AdminRecentBooking[];
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Recent bookings</CardTitle>
        <Button variant="ghost" size="sm" className="rounded-full" asChild>
          <Link href="/admin/bookings">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            <CalendarCheck className="mb-2 h-8 w-8 opacity-50" />
            No bookings yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-muted-foreground">
                  <th className="pb-3 pr-3 font-medium">Code</th>
                  <th className="pb-3 pr-3 font-medium">Date</th>
                  <th className="pb-3 pr-3 font-medium">Amount</th>
                  <th className="pb-3 pr-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-3 font-mono text-xs">{booking.booking_code}</td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {new Date(booking.service_date).toLocaleDateString("en-ZM")}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">{formatCurrency(booking.amount)}</td>
                    <td className="py-3 pr-3">
                      <Badge variant={bookingStatusVariant(booking.status)}>
                        {formatAdminLabel(booking.status)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={paymentStatusVariant(booking.payment_status)}>
                        {formatAdminLabel(booking.payment_status)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
