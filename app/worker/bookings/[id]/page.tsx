import { createAuthenticatedServerClient } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { BookingTimeline } from "@/components/booking-timeline";
import { WorkerBookingActions } from "@/components/booking/worker-booking-actions";
import { BookingNextStepBanner } from "@/components/booking/booking-next-step";
import { getWorkerBookingNextStep, formatPaymentStatusLabel } from "@/lib/bookings/display-labels";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Calendar, Clock, CreditCard, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { BookingStatus } from "@/types";
import type { ServiceDetails } from "@/lib/services/catalog";
import { ServiceSummary } from "@/components/services/service-summary";

export default async function WorkerBookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "worker") redirect("/dashboard");

  const supabase = createAuthenticatedServerClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      customer:customer_id(
        id,
        full_name,
        phone
      )
    `)
    .eq("id", params.id)
    .eq("worker_id", user.id)
    .single();

  if (error || !booking) notFound();

  const customer = Array.isArray(booking.customer) ? booking.customer[0] : booking.customer;
  const nextStep = getWorkerBookingNextStep({
    status: booking.status as BookingStatus,
    paymentStatus: booking.payment_status || "pending",
    customerName: customer?.full_name,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job #{booking.booking_code}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Requested on {formatDate(booking.created_at)}
          </p>
        </div>
        <Badge 
          variant={
            booking.status === "completed" ? "default" :
            booking.status === "cancelled" ? "destructive" :
            booking.status === "in_progress" ? "secondary" :
            "outline"
          }
          className="capitalize text-sm px-3 py-1"
        >
          {booking.status.replace("_", " ")}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <BookingNextStepBanner step={nextStep} />
          <BookingTimeline currentStatus={booking.status} />
        </CardContent>
      </Card>

      {booking.service_details && (
        <ServiceSummary details={booking.service_details as ServiceDetails} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-700 font-semibold text-lg">
                {booking.customer?.full_name?.charAt(0) || "?"}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-semibold">{booking.customer?.full_name}</div>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <a 
                  href={`tel:${booking.customer?.phone}`}
                  className="flex items-center gap-1 text-emerald-600 hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  {booking.customer?.phone}
                </a>
                <Link 
                  href={`/messages?customer=${booking.customer_id}`}
                  className="flex items-center gap-1 text-emerald-600 hover:underline"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">{formatDate(booking.service_date)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Time</div>
                <div className="font-medium">{booking.service_time}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-medium">{booking.location_address}</div>
            </div>
          </div>

          {booking.description && (
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Customer Notes</div>
                <div className="text-foreground bg-surface p-3 rounded-lg mt-1">
                  {booking.description}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-lg">{formatCurrency(booking.worker_earnings)}</div>
                <div className="text-sm text-muted-foreground">
                  Your earnings after platform fee
                  {booking.payment_status === "paid" || booking.payment_status === "confirmed"
                    ? ` · ${formatPaymentStatusLabel(booking.payment_status)}`
                    : " · Payment pending"}
                </div>
              </div>
            </div>
            {(booking.payment_status === "paid" || booking.payment_status === "confirmed") && (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                Paid
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <WorkerBookingActions
        bookingId={booking.id}
        status={booking.status as BookingStatus}
      />

      <Button variant="outline" asChild className="w-full">
        <Link href="/worker/bookings">Back to Jobs</Link>
      </Button>
    </div>
  );
}
