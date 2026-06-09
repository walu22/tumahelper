import { getServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { VerificationBadge } from "@/components/verification-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Calendar, Star, FileText, Settings, Clock } from "lucide-react";

export default async function WorkerDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "worker") redirect("/login");

  const supabase = getServerClient();

  const { data: profile } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: upcomingBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      customer:customer_id(full_name, profile_photo_url)
    `)
    .eq("worker_id", user.id)
    .in("status", ["pending", "accepted", "in_progress"])
    .order("service_date", { ascending: true })
    .limit(5);

  const { data: earnings } = await supabase
    .from("bookings")
    .select("amount")
    .eq("worker_id", user.id)
    .eq("payment_status", "confirmed");

  const totalEarnings = (earnings || []).reduce((sum, b) => sum + b.amount, 0);

  const [pendingDocsResult, totalReviewsResult] = await Promise.all([
    supabase.from("verification_documents").select("id", { count: "exact" }).eq("worker_id", user.id),
    supabase.from("reviews").select("id", { count: "exact" }).eq("reviewee_id", user.id),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Worker Dashboard</h1>
        <Link href="/worker/profile">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile?.full_name || user.full_name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <TrustScoreBadge score={profile?.trust_score || 0} isProvisional={profile?.is_provisional} size="sm" />
              <VerificationBadge level={profile?.verification_level || "none"} size="sm" />
            </div>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{(profile?.average_rating || 0).toFixed(1)}</span>
                <span className="text-gray-400">({totalReviewsResult.count || 0} reviews)</span>
              </div>
              <div className="text-gray-600">
                <span className="font-medium">{formatCurrency(totalEarnings)}</span> earned
              </div>
              <div className="text-gray-600">
                <span className="font-medium">{profile?.total_jobs_completed || 0}</span> jobs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{upcomingBookings?.length || 0}</div>
          <div className="text-sm text-gray-500">Upcoming</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{profile?.availability_status || "unavailable"}</div>
          <div className="text-sm text-gray-500">Status</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{pendingDocsResult.count || 0}</div>
          <div className="text-sm text-gray-500">Pending Docs</div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        {upcomingBookings && upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking: any) => (
              <Link key={booking.id} href={`/worker/bookings/${booking.id}`}>
                <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{booking.customer?.full_name}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.service_date)} at {booking.service_time}
                      </div>
                      <div className="text-sm text-gray-500">{booking.location_address}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium capitalize text-primary">{booking.status}</span>
                      <div className="text-sm text-gray-500">{formatCurrency(booking.amount)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            No upcoming bookings. Update your availability to get hired.
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/worker/profile/verify">
            <div className="bg-white rounded-lg shadow-sm border p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">Upload Documents</div>
            </div>
          </Link>
          <Link href="/worker/availability">
            <div className="bg-white rounded-lg shadow-sm border p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">Set Availability</div>
            </div>
          </Link>
          <Link href="/jobs">
            <div className="bg-white rounded-lg shadow-sm border p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-sm font-medium">Find Jobs</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
