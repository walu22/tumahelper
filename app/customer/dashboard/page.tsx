import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createAuthenticatedServerClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerDashboardBookingItem } from "@/components/customer/customer-dashboard-booking-item";
import { attachBookAgainHrefs } from "@/lib/bookings/book-again-enrich";
import { WorkerStatCard } from "@/components/worker/worker-stat-card";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  Baby,
  Calendar,
  ChevronRight,
  Clock,
  Home,
  Plus,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function CustomerDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/customer/dashboard");

  const supabase = createAuthenticatedServerClient();
  const displayName = user.full_name || "there";
  const greeting = greetingForHour(new Date().getHours());

  const { data: bookingRows } = await supabase
    .from("bookings")
    .select(`
      id,
      booking_code,
      status,
      service_date,
      service_time,
      location_address,
      amount,
      platform_fee,
      payment_status,
      created_at,
      worker_id,
      category_id,
      service_details,
      worker:worker_id(full_name)
    `)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const normalized = (bookingRows || []).map((b) => ({
    ...b,
    worker: Array.isArray(b.worker) ? b.worker[0] : b.worker,
  }));

  const bookings = await attachBookAgainHrefs(supabase, normalized);

  const upcoming = bookings.filter((b) =>
    ["pending", "accepted", "in_progress"].includes(b.status)
  );
  const completed = bookings.filter((b) => b.status === "completed");
  const needsPayment = bookings.filter(
    (b) =>
      !["cancelled", "declined", "completed"].includes(b.status) &&
      !["paid", "confirmed"].includes(b.payment_status)
  );
  const awaitingWorker = bookings.filter((b) => b.status === "pending");

  const { data: reviews } = await supabase
    .from("reviews")
    .select("overall_rating")
    .eq("reviewer_id", user.id);

  const avgRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.overall_rating, 0) / reviews.length).toFixed(1)
      : "—";

  const totalSpent = bookings
    .filter((b) => ["paid", "confirmed"].includes(b.payment_status))
    .reduce((sum, b) => sum + b.amount + (b.platform_fee ?? 0), 0);

  const recentBookings = bookings.slice(0, 5);

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
              {needsPayment.length > 0
                ? `${needsPayment.length} booking${needsPayment.length === 1 ? "" : "s"} need payment or follow-up.`
                : upcoming.length > 0
                  ? `You have ${upcoming.length} upcoming booking${upcoming.length === 1 ? "" : "s"}.`
                  : "Book trusted help for your home in a few steps."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/customer/bookings">
              <Button variant="outline" className="rounded-full">
                <Calendar className="h-4 w-4 mr-2" />
                All bookings
              </Button>
            </Link>
            <Link href="/customer/book">
              <Button className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                New booking
              </Button>
            </Link>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-8 mb-8 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Book help today
              </p>
              <h2 className="font-display text-2xl font-bold mb-2">
                Nannies & home cleaning in Lusaka
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Choose your service, pick a verified worker, and pay securely with mobile money.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/customer/book?category=nanny">
                <Button variant="outline" className="rounded-full w-full sm:w-auto gap-2">
                  <Baby className="h-4 w-4" />
                  Book a nanny
                </Button>
              </Link>
              <Link href="/customer/book?category=cleaning">
                <Button variant="outline" className="rounded-full w-full sm:w-auto gap-2">
                  <Sparkles className="h-4 w-4" />
                  Book cleaning
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <WorkerStatCard
            label="Upcoming"
            value={String(upcoming.length)}
            hint="Pending, accepted, or in progress"
            icon={Calendar}
            tone="blue"
          />
          <WorkerStatCard
            label="Completed"
            value={String(completed.length)}
            hint="Finished visits"
            icon={Clock}
            tone="green"
          />
          <WorkerStatCard
            label="Total spent"
            value={formatCurrency(totalSpent)}
            hint="Confirmed payments"
            icon={Home}
            tone="primary"
          />
          <WorkerStatCard
            label="Reviews given"
            value={avgRating}
            hint={reviews?.length ? `${reviews.length} review${reviews.length === 1 ? "" : "s"}` : "No reviews yet"}
            icon={Star}
            tone="amber"
          />
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-6">
            {needsPayment.length > 0 && (
              <Card className="rounded-2xl border-amber-200/80 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Needs your attention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {needsPayment.slice(0, 3).map((booking) => (
                    <CustomerDashboardBookingItem
                      key={booking.id}
                      booking={booking}
                      highlight
                      bookAgainHref={booking.bookAgainHref}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {awaitingWorker.length > 0 && needsPayment.length === 0 && (
              <Card className="rounded-2xl border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Waiting for worker</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {awaitingWorker.slice(0, 3).map((booking) => (
                    <CustomerDashboardBookingItem
                      key={booking.id}
                      booking={booking}
                      bookAgainHref={booking.bookAgainHref}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Recent bookings</CardTitle>
                <Link href="/customer/bookings">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentBookings.length > 0 ? (
                  <div className="space-y-3">
                    {recentBookings.map((booking) => (
                      <CustomerDashboardBookingItem
                      key={booking.id}
                      booking={booking}
                      bookAgainHref={booking.bookAgainHref}
                    />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4">
                    <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="font-medium text-foreground">No bookings yet</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                      Book a nanny or cleaner and your recent visits will show up here.
                    </p>
                    <Link href="/customer/book">
                      <Button className="mt-4 rounded-full">Book help</Button>
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
                    href: "/customer/book?category=nanny",
                    label: "Book a nanny",
                    desc: "Babysitting, after-school, part-time",
                    icon: Baby,
                  },
                  {
                    href: "/customer/book?category=cleaning",
                    label: "Book cleaning",
                    desc: "Standard, deep, or move-out clean",
                    icon: Sparkles,
                  },
                  {
                    href: "/workers",
                    label: "Find workers",
                    desc: "Browse verified profiles",
                    icon: Search,
                  },
                  {
                    href: "/customer/bookings",
                    label: "My bookings",
                    desc: "Track status and payments",
                    icon: Calendar,
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

            <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
              <CardContent className="p-5">
                <p className="font-semibold text-sm mb-1">Need permanent help?</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse live-in nanny and long-term domestic roles.
                </p>
                <Link href="/hire">
                  <Button size="sm" variant="outline" className="w-full rounded-full">
                    Explore permanent hire
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
