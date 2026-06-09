import { getServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingTimeline } from "@/components/booking-timeline";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Calendar, Plus, Star } from "lucide-react";

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "customer") redirect("/login");

  const supabase = getServerClient();

  const { data: upcomingBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      worker:worker_id(full_name, profile_photo_url)
    `)
    .eq("customer_id", user.id)
    .in("status", ["pending", "accepted", "in_progress"])
    .order("service_date", { ascending: true })
    .limit(5);

  const { data: pastBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      worker:worker_id(full_name, profile_photo_url)
    `)
    .eq("customer_id", user.id)
    .in("status", ["completed", "cancelled"])
    .order("service_date", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link href="/customer/book">
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Book a Worker
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Bookings
        </h2>
        {upcomingBookings && upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking: any) => (
              <Link key={booking.id} href={`/bookings/${booking.id}`}>
                <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {booking.worker?.profile_photo_url ? (
                          <img src={booking.worker.profile_photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {booking.worker?.full_name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{booking.worker?.full_name}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.service_date)} at {booking.service_time}
                        </div>
                        <div className="text-sm text-gray-500">{booking.location_address}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium capitalize">{booking.status}</div>
                      <div className="text-sm text-gray-500">{formatCurrency(booking.amount)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No upcoming bookings</p>
            <Link href="/customer/book">
              <Button variant="outline">Book your first worker</Button>
            </Link>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
        {pastBookings && pastBookings.length > 0 ? (
          <div className="space-y-4">
            {pastBookings.map((booking: any) => (
              <Link key={booking.id} href={`/bookings/${booking.id}`}>
                <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-opacity opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{booking.worker?.full_name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.service_date)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.status === "completed" && !booking.customer_rating && (
                        <span className="text-sm text-primary font-medium">Rate now</span>
                      )}
                      {booking.customer_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{booking.customer_rating}</span>
                        </div>
                      )}
                      <span className={`text-sm capitalize ${
                        booking.status === "completed" ? "text-green-600" : "text-red-600"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No past bookings yet</p>
        )}
      </div>
    </div>
  );
}
