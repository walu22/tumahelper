"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookingTimeline } from "@/components/booking-timeline";
import { WorkerBookingActions } from "@/components/booking/worker-booking-actions";
import { BookingNextStepBanner } from "@/components/booking/booking-next-step";
import { getWorkerBookingNextStep, formatPaymentStatusLabel } from "@/lib/bookings/display-labels";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Calendar, Clock, CreditCard, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import type { BookingStatus } from "@/types";
import type { ServiceDetails } from "@/lib/services/catalog";
import { ServiceSummary } from "@/components/services/service-summary";

interface WorkerBookingRecord {
  id: string;
  booking_code: string;
  customer_id: string;
  status: BookingStatus;
  payment_status: string;
  service_date: string;
  service_time: string;
  location_address: string;
  description: string | null;
  worker_earnings: number;
  created_at: string;
  service_details: ServiceDetails | null;
  customer: {
    id: string;
    full_name: string;
    phone: string;
  } | null;
}

export function WorkerBookingDetail({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<WorkerBookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBooking() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Booking not found");
        }

        if (!cancelled) {
          const record = json.data as WorkerBookingRecord & {
            customer?: WorkerBookingRecord["customer"] | WorkerBookingRecord["customer"][];
          };
          const customer = Array.isArray(record.customer)
            ? record.customer[0] ?? null
            : record.customer ?? null;

          setBooking({ ...record, customer });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load booking");
          setBooking(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading job details…
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">{error || "Booking not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/worker/bookings">Back to Jobs</Link>
        </Button>
      </div>
    );
  }

  const nextStep = getWorkerBookingNextStep({
    status: booking.status,
    paymentStatus: booking.payment_status || "pending",
    customerName: booking.customer?.full_name,
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
            booking.status === "completed"
              ? "default"
              : booking.status === "cancelled"
                ? "destructive"
                : booking.status === "in_progress"
                  ? "secondary"
                  : "outline"
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

      {booking.service_details && <ServiceSummary details={booking.service_details} />}

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
        status={booking.status}
        onStatusChange={(status) => setBooking((current) => (current ? { ...current, status } : current))}
      />

      <Button variant="outline" asChild className="w-full">
        <Link href="/worker/bookings">Back to Jobs</Link>
      </Button>
    </div>
  );
}
