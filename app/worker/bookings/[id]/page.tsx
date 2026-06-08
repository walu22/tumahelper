import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { BookingTimeline } from "@/components/booking-timeline";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Calendar, Clock, CreditCard, MessageSquare, AlertCircle, CheckCircle, XCircle, Play } from "lucide-react";
import Link from "next/link";

const statusActions = {
  pending: [
    { label: "Accept Booking", action: "accepted", icon: CheckCircle, variant: "default" as const },
    { label: "Decline", action: "declined", icon: XCircle, variant: "outline" as const },
  ],
  accepted: [
    { label: "Start Job", action: "in_progress", icon: Play, variant: "default" as const },
  ],
  in_progress: [
    { label: "Complete Job", action: "completed", icon: CheckCircle, variant: "default" as const },
  ],
};

export default async function WorkerBookingDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createServerSupabaseClient();

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

  const actions = statusActions[booking.status as keyof typeof statusActions] || [];

  async function updateStatus(formData: FormData) {
    "use server";
    const newStatus = formData.get("status") as string;
    
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("worker_id", user.id);

    if (error) throw error;
    
    redirect("/worker/bookings");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job #{booking.booking_code}</h1>
          <p className="text-gray-500 text-sm mt-1">
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
        <CardContent className="pt-6">
          <BookingTimeline currentStatus={booking.status} />
        </CardContent>
      </Card>

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
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">{formatDate(booking.service_date)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Time</div>
                <div className="font-medium">{booking.service_time}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">{booking.location_address}</div>
            </div>
          </div>

          {booking.description && (
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Customer Notes</div>
                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
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
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-lg">{formatCurrency(booking.amount)}</div>
                <div className="text-sm text-gray-500">
                  {booking.payment_status === "paid" ? "Paid to your account" : "Payment pending"}
                </div>
              </div>
            </div>
            {booking.payment_status === "paid" && (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                Paid
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {actions.length > 0 && (
        <div className="flex gap-3">
          {actions.map((action) => (
            <form key={action.action} action={updateStatus}>
              <input type="hidden" name="status" value={action.action} />
              <Button 
                type="submit" 
                variant={action.variant}
                className="gap-2"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </Button>
            </form>
          ))}
        </div>
      )}

      <Button variant="outline" asChild className="w-full">
        <Link href="/worker/bookings">Back to Jobs</Link>
      </Button>
    </div>
  );
}
