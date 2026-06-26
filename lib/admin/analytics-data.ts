import { getAdminSupabaseClient } from "@/lib/admin/supabase";
import { formatCurrency } from "@/lib/utils";

export type AdminAnalyticsMonth = {
  label: string;
  bookings: number;
  revenue: number;
};

export type AdminAnalyticsMetric = {
  label: string;
  value: string;
  hint: string;
};

export type AdminAnalyticsData = {
  metrics: AdminAnalyticsMetric[];
  monthlyTrend: AdminAnalyticsMonth[];
  usingLocalDemoData: boolean;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function formatGrowth(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? "+100%" : "0%";
  const pct = Math.round(((current - previous) / previous) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

function buildLastSixMonths() {
  const months: Date[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }
  return months;
}

function emptyAnalyticsData(): AdminAnalyticsData {
  const months = buildLastSixMonths();
  return {
    metrics: [
      { label: "Active workers", value: "0", hint: "Currently available" },
      { label: "Bookings this month", value: "0", hint: "Month over month: 0%" },
      { label: "Revenue this month", value: formatCurrency(0), hint: "Confirmed payments" },
      { label: "Revenue growth", value: "0%", hint: "Compared to last month" },
    ],
    monthlyTrend: months.map((date) => ({
      label: `${MONTH_LABELS[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`,
      bookings: 0,
      revenue: 0,
    })),
    usingLocalDemoData: true,
  };
}

export async function getAdminAnalyticsData(): Promise<AdminAnalyticsData> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return emptyAnalyticsData();
  }

  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const trendStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      activeWorkersResult,
      monthBookingsResult,
      prevBookingsResult,
      monthPaymentsResult,
      prevPaymentsResult,
      trendBookingsResult,
      trendPaymentsResult,
    ] = await Promise.all([
      supabase
        .from("worker_profiles")
        .select("*", { count: "exact", head: true })
        .eq("availability_status", "available"),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gte("created_at", monthStart.toISOString()),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gte("created_at", prevMonthStart.toISOString())
        .lt("created_at", monthStart.toISOString()),
      supabase
        .from("payments")
        .select("amount")
        .eq("status", "confirmed")
        .gte("created_at", monthStart.toISOString()),
      supabase
        .from("payments")
        .select("amount")
        .eq("status", "confirmed")
        .gte("created_at", prevMonthStart.toISOString())
        .lt("created_at", monthStart.toISOString()),
      supabase
        .from("bookings")
        .select("created_at")
        .gte("created_at", trendStart.toISOString()),
      supabase
        .from("payments")
        .select("amount, created_at")
        .eq("status", "confirmed")
        .gte("created_at", trendStart.toISOString()),
    ]);

    const activeWorkers = activeWorkersResult.count ?? 0;
    const monthlyBookings = monthBookingsResult.count ?? 0;
    const prevBookings = prevBookingsResult.count ?? 0;
    const monthlyRevenue = (monthPaymentsResult.data ?? []).reduce(
      (sum, payment) => sum + (payment.amount ?? 0),
      0
    );
    const prevRevenue = (prevPaymentsResult.data ?? []).reduce(
      (sum, payment) => sum + (payment.amount ?? 0),
      0
    );

    const bookingCounts = new Map<string, number>();
    const revenueTotals = new Map<string, number>();

    for (const booking of trendBookingsResult.data ?? []) {
      const key = monthKey(new Date(booking.created_at));
      bookingCounts.set(key, (bookingCounts.get(key) ?? 0) + 1);
    }

    for (const payment of trendPaymentsResult.data ?? []) {
      const key = monthKey(new Date(payment.created_at));
      revenueTotals.set(key, (revenueTotals.get(key) ?? 0) + (payment.amount ?? 0));
    }

    const monthlyTrend = buildLastSixMonths().map((date) => ({
      label: `${MONTH_LABELS[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`,
      bookings: bookingCounts.get(monthKey(date)) ?? 0,
      revenue: revenueTotals.get(monthKey(date)) ?? 0,
    }));

    return {
      metrics: [
        {
          label: "Active workers",
          value: String(activeWorkers),
          hint: "Currently available for bookings",
        },
        {
          label: "Bookings this month",
          value: String(monthlyBookings),
          hint: `Month over month: ${formatGrowth(monthlyBookings, prevBookings)}`,
        },
        {
          label: "Revenue this month",
          value: formatCurrency(monthlyRevenue),
          hint: "Confirmed payments",
        },
        {
          label: "Revenue growth",
          value: formatGrowth(monthlyRevenue, prevRevenue),
          hint: "Compared to last month",
        },
      ],
      monthlyTrend,
      usingLocalDemoData: false,
    };
  } catch {
    return emptyAnalyticsData();
  }
}
