import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Scale,
  User,
  Users,
} from "lucide-react";
import { BookingTimeline } from "@/components/booking-timeline";
import type { BookingStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminBookingDetail } from "@/lib/admin/booking-detail-data";
import {
  bookingStatusVariant,
  disputeStatusVariant,
  formatAdminLabel,
  paymentRecordStatusVariant,
  paymentStatusVariant,
} from "@/lib/admin/status-badges";
import { AdminConfirmPaymentButton } from "@/components/admin/admin-confirm-payment-button";
import { formatCurrency, formatDate } from "@/lib/utils";

export function AdminBookingDetailPanel({ booking }: { booking: AdminBookingDetail }) {
  const needsPaymentReview =
    booking.payment_status === "paid" ||
    booking.payments.some((payment) => payment.status === "pending" || payment.status === "paid");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link href="/admin/bookings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Booking</p>
            <h2 className="truncate font-display text-xl font-semibold tracking-tight">
              #{booking.booking_code}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={bookingStatusVariant(booking.status)}>
            {formatAdminLabel(booking.status)}
          </Badge>
          <Badge variant={paymentStatusVariant(booking.payment_status)}>
            Payment: {formatAdminLabel(booking.payment_status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Visit details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                icon={Calendar}
                label="Service date"
                value={formatDate(booking.service_date)}
              />
              <DetailItem
                icon={Clock}
                label="Service time"
                value={booking.service_time?.slice(0, 5) ?? "—"}
              />
              <DetailItem
                icon={MapPin}
                label="Location"
                value={booking.location_address}
                className="sm:col-span-2"
              />
              {booking.category ? (
                <DetailItem
                  icon={Users}
                  label="Service type"
                  value={formatAdminLabel(booking.category.name)}
                  className="sm:col-span-2"
                />
              ) : null}
            </CardContent>
          </Card>

          {booking.description ? (
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Customer notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{booking.description}</p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Booking progress</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTimeline currentStatus={booking.status as BookingStatus} />
            </CardContent>
          </Card>

          {booking.disputes.length > 0 ? (
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Scale className="h-4 w-4" />
                  Related disputes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.disputes.map((dispute) => (
                  <div
                    key={dispute.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{formatAdminLabel(dispute.dispute_type)}</p>
                      <p className="text-xs text-muted-foreground">
                        Opened {formatDate(dispute.created_at)}
                      </p>
                    </div>
                    <Badge variant={disputeStatusVariant(dispute.status)}>
                      {formatAdminLabel(dispute.status)}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link href="/admin/disputes?status=open">Open disputes queue</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Payment summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <SummaryRow label="Total amount" value={formatCurrency(booking.amount)} />
              <SummaryRow label="Platform fee" value={formatCurrency(booking.platform_fee)} />
              <SummaryRow label="Worker earnings" value={formatCurrency(booking.worker_earnings)} />
              {booking.payment_method ? (
                <SummaryRow
                  label="Method"
                  value={formatAdminLabel(booking.payment_method)}
                />
              ) : null}
              {needsPaymentReview ? (
                <div className="mt-2 space-y-2">
                  <AdminConfirmPaymentButton bookingId={booking.id} />
                  <Button size="sm" variant="outline" className="w-full rounded-full" asChild>
                    <Link href="/admin/payments?status=pending">Open payments queue</Link>
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{booking.customer?.full_name || "Unknown customer"}</p>
              <p className="text-muted-foreground">{booking.customer?.phone || "No phone on file"}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Worker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-medium">{booking.worker?.full_name || "Unassigned"}</p>
              <p className="text-muted-foreground">{booking.worker?.phone || "No phone on file"}</p>
              {booking.worker?.profile_id ? (
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link href={`/admin/workers/${booking.worker.profile_id}`}>Open worker profile</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>

          {booking.payments.length > 0 ? (
            <Card className="rounded-2xl border-border/70 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" />
                  Payment records
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-xl border border-border/60 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs">{payment.payment_code}</span>
                      <Badge variant={paymentRecordStatusVariant(payment.status)}>
                        {formatAdminLabel(payment.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="space-y-2 p-4 text-sm">
              <SummaryRow label="Created" value={formatDate(booking.created_at)} />
              <SummaryRow label="Last updated" value={formatDate(booking.updated_at)} />
              {booking.cancellation_reason ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
                  <p className="text-xs font-medium text-destructive">Cancellation reason</p>
                  <p className="mt-1 text-muted-foreground">{booking.cancellation_reason}</p>
                </div>
              ) : null}
              {booking.customer_review ? (
                <div className="rounded-xl border border-border/60 px-3 py-2">
                  <p className="text-xs font-medium">Customer review</p>
                  <p className="mt-1 text-muted-foreground">{booking.customer_review}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-sm">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
