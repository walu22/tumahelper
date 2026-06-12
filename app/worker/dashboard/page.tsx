import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createAuthenticatedServerClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustScoreBadge } from "@/components/trust-score-badge";
import { VerificationBadge } from "@/components/verification-badge";
import { WorkerDashboardBookingItem } from "@/components/worker/worker-dashboard-booking-item";
import { WorkerStatCard } from "@/components/worker/worker-stat-card";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronRight,
  FileText,
  Settings,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";

const availabilityLabels: Record<string, string> = {
  available: "Available",
  busy: "Busy",
  unavailable: "Unavailable",
};

const categoryLabels: Record<string, string> = {
  nanny: "Nanny",
  house_cleaner: "House cleaner",
};

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function WorkerDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "worker") redirect("/login");

  const supabase = createAuthenticatedServerClient();

  const { data: profile } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: upcomingBookings } = await supabase
    .from("bookings")
    .select(`
      id,
      booking_code,
      status,
      service_date,
      service_time,
      location_address,
      amount,
      worker_earnings,
      customer:customer_id(full_name)
    `)
    .eq("worker_id", user.id)
    .in("status", ["pending", "accepted", "in_progress"])
    .order("service_date", { ascending: true })
    .limit(6);

  const { data: paidBookings } = await supabase
    .from("bookings")
    .select("worker_earnings, amount, service_date, payment_status")
    .eq("worker_id", user.id)
    .in("payment_status", ["confirmed", "paid"]);

  const totalEarnings = (paidBookings || []).reduce(
    (sum, b) => sum + (b.worker_earnings ?? b.amount),
    0
  );

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const earningsThisMonth = (paidBookings || [])
    .filter((b) => b.service_date >= monthStart)
    .reduce((sum, b) => sum + (b.worker_earnings ?? b.amount), 0);

  const [reviewsResult, docsInReviewResult] = await Promise.all([
    supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("reviewee_id", user.id),
    supabase
      .from("verification_documents")
      .select("id", { count: "exact", head: true })
      .eq("worker_id", user.id)
      .in("status", ["submitted", "under_review"]),
  ]);

  const bookings = (upcomingBookings || []).map((b) => ({
    ...b,
    customer: Array.isArray(b.customer) ? b.customer[0] : b.customer,
  }));
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const scheduledBookings = bookings.filter((b) => b.status !== "pending");
  const availability = profile?.availability_status || "unavailable";
  const displayName = profile?.full_name || user.full_name || "Worker";
  const greeting = greetingForHour(now.getHours());

  return (
    <div className="min-h-screen bg-surface/40">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-primary mb-1">{greeting}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              {displayName}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              {pendingBookings.length > 0
                ? `You have ${pendingBookings.length} booking request${pendingBookings.length === 1 ? "" : "s"} waiting for your response.`
                : "Manage your jobs, earnings, and profile from one place."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/worker/bookings">
              <Button variant="outline" className="rounded-full">
                <Briefcase className="h-4 w-4 mr-2" />
                All jobs
              </Button>
            </Link>
            <Link href="/worker/profile">
              <Button className="rounded-full">
                <Settings className="h-4 w-4 mr-2" />
                Edit profile
              </Button>
            </Link>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-white p-6 md:p-8 mb-8 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-primary/10 overflow-hidden shrink-0 ring-4 ring-white shadow-md">
              {profile?.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-primary">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {profile?.category && (
                  <Badge variant="secondary" className="capitalize">
                    {categoryLabels[profile.category] || profile.category.replace("_", " ")}
                  </Badge>
                )}
                <Badge
                  variant={availability === "available" ? "success" : "warning"}
                  className="capitalize"
                >
                  {availabilityLabels[availability] || availability}
                </Badge>
                {profile?.area && (
                  <span className="text-sm text-muted-foreground">{profile.area}, Lusaka</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <TrustScoreBadge
                  score={profile?.trust_score || 0}
                  isProvisional={profile?.is_provisional}
                  size="sm"
                />
                <VerificationBadge level={profile?.verification_level || "none"} size="sm" />
              </div>

              <div className="mt-4 flex flex-wrap gap-5 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold">
                    {(profile?.average_rating || 0).toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({reviewsResult.count || 0} reviews)
                  </span>
                </div>
                <div className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {profile?.total_jobs_completed || 0}
                  </span>{" "}
                  jobs completed
                </div>
              </div>
            </div>

            <div className="md:text-right shrink-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Total earned
              </p>
              <p className="font-display text-3xl font-bold">{formatCurrency(totalEarnings)}</p>
              <Link
                href="/worker/earnings"
                className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-2 hover:underline"
              >
                View earnings
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <WorkerStatCard
            label="Upcoming jobs"
            value={String(bookings.length)}
            hint={`${pendingBookings.length} need a response`}
            icon={Calendar}
            tone="blue"
          />
          <WorkerStatCard
            label="This month"
            value={formatCurrency(earningsThisMonth)}
            hint="Confirmed payments"
            icon={Wallet}
            tone="green"
          />
          <WorkerStatCard
            label="Availability"
            value={availabilityLabels[availability] || availability}
            hint="Update in profile"
            icon={Briefcase}
            tone={availability === "available" ? "green" : "amber"}
          />
          <WorkerStatCard
            label="Docs in review"
            value={String(docsInReviewResult.count || 0)}
            hint="Verification uploads"
            icon={FileText}
            tone="amber"
          />
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-6">
            {pendingBookings.length > 0 && (
              <Card className="rounded-2xl border-amber-200/80 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                    Needs your response
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingBookings.map((booking) => (
                    <WorkerDashboardBookingItem
                      key={booking.id}
                      booking={booking}
                      highlight
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Upcoming schedule</CardTitle>
                <Link href="/worker/bookings?status=upcoming">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {scheduledBookings.length > 0 ? (
                  <div className="space-y-3">
                    {scheduledBookings.map((booking) => (
                      <WorkerDashboardBookingItem key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : pendingBookings.length > 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Accepted and in-progress jobs will appear here.
                  </p>
                ) : (
                  <div className="text-center py-10 px-4">
                    <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="font-medium text-foreground">No upcoming jobs yet</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                      Set your availability to available and keep your profile verified to get
                      more bookings.
                    </p>
                    <Link href="/worker/profile">
                      <Button variant="outline" className="mt-4 rounded-full">
                        Update availability
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {[
                  {
                    href: "/worker/bookings",
                    label: "My jobs",
                    desc: "Accept, start, and complete",
                    icon: Briefcase,
                  },
                  {
                    href: "/worker/profile/verify",
                    label: "Verification",
                    desc: "Upload NRC and documents",
                    icon: FileText,
                  },
                  {
                    href: "/worker/profile",
                    label: "Availability",
                    desc: "Open or pause new work",
                    icon: Calendar,
                  },
                  {
                    href: "/jobs",
                    label: "Permanent jobs",
                    desc: "Browse long-term roles",
                    icon: Star,
                  },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            {profile?.verification_status !== "approved" && (
              <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
                <CardContent className="p-5">
                  <p className="font-semibold text-sm mb-1">Boost your visibility</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Verified workers appear higher in search and win more bookings.
                  </p>
                  <Link href="/worker/profile/verify">
                    <Button size="sm" className="w-full rounded-full">
                      Complete verification
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
