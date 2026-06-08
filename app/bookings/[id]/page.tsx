import { getServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingTimeline } from "@/components/booking-timeline";
import { StarRating } from "@/components/star-rating";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, CreditCard } from "lucide-react";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = getServerClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      worker:worker_id(full_name, profile_photo_url, phone),
      customer:customer_id(full_name, phone)
    `)
    .eq("id", params.id)
    .single();

  if (!booking) redirect("/dashboard");

  const isCustomer = user.id === booking.customer_id;
  const isWorker = user.id === booking.worker_id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Booking {booking.booking_code}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
            booking.status === "completed" ? "bg-green-100 text-green-800" :
            booking.status === "cancelled" ? "bg-red-100 text-red-800" :
            "bg-blue-100 text-blue-800"
          }`}>
            {booking.status}
          </span>
        </div>

        <BookingTimeline currentStatus={booking.status} />

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              {booking.worker?.profile_photo_url ? (
                <img src={booking.worker.profile_photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                  {booking.worker?.full_name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-lg">{booking.worker?.full_name}</div>
              <div className="text-sm text-gray-500">{isCustomer ? "Your worker" : "Customer"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Date</div>
              <div className="font-medium">{formatDate(booking.service_date)}</div>
            </div>
            <div>
              <div className="text-gray-500">Time</div>
              <div className="font-medium">{booking.service_time}</div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Location
              </div>
              <div className="font-medium">{booking.location_address}</div>
            </div>
            {booking.description && (
              <div className="col-span-2">
                <div className="text-gray-500">Notes</div>
                <div>{booking.description}</div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-500">Amount</div>
                <div className="text-2xl font-bold">{formatCurrency(booking.amount)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Platform Fee</div>
                <div className="font-medium">{formatCurrency(booking.platform_fee || 0)}</div>
              </div>
            </div>
          </div>

          {isCustomer && booking.status === "completed" && !booking.customer_rating && (
            <div className="border-t pt-4">
              <div className="text-sm text-gray-500 mb-2">Rate this worker</div>
              <StarRating value={0} size="lg" />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {booking.payment_status === "pending" && isCustomer && (
              <Button className="flex-1">
                <CreditCard className="w-4 h-4 mr-2" />
                Upload Payment Proof
              </Button>
            )}
            {["pending", "accepted"].includes(booking.status) && (
              <Button variant="outline" className="flex-1">Cancel Booking</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
