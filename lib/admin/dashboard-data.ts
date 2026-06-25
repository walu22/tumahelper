import { getAdminSupabaseClient } from "@/lib/admin/supabase";
import { formatCurrency } from "@/lib/utils";

export type AdminAttentionItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  tone: "warning" | "destructive" | "info";
};

export type AdminStat = {
  label: string;
  value: string;
  hint: string;
  href: string;
};

export type AdminRecentBooking = {
  id: string;
  booking_code: string;
  service_date: string;
  amount: number;
  status: string;
  payment_status: string;
};

export type AdminRecentWorker = {
  id: string;
  full_name: string;
  area: string;
  city: string;
  verification_status: string;
  created_at: string;
};

export type AdminDashboardData = {
  stats: AdminStat[];
  attentionItems: AdminAttentionItem[];
  recentBookings: AdminRecentBooking[];
  recentWorkers: AdminRecentWorker[];
  confirmedRevenue: string;
  usingLocalDemoData: boolean;
};

function buildStats(input: {
  totalWorkers: number;
  activeBookings: number;
  pendingDocuments: number;
  pendingPayments: number;
  openDisputes: number;
  confirmedRevenue: number;
}): AdminStat[] {
  return [
    {
      label: "Workers",
      value: String(input.totalWorkers),
      hint: "Registered on the platform",
      href: "/admin/workers",
    },
    {
      label: "Active bookings",
      value: String(input.activeBookings),
      hint: "Pending, accepted, or in progress",
      href: "/admin/bookings",
    },
    {
      label: "Pending documents",
      value: String(input.pendingDocuments),
      hint: "Awaiting verification review",
      href: "/admin/documents",
    },
    {
      label: "Payments to confirm",
      value: String(input.pendingPayments),
      hint: "Proof submitted by customers",
      href: "/admin/payments",
    },
    {
      label: "Open disputes",
      value: String(input.openDisputes),
      hint: "Not yet resolved",
      href: "/admin/disputes",
    },
    {
      label: "Confirmed revenue",
      value: formatCurrency(input.confirmedRevenue),
      hint: "All confirmed payments",
      href: "/admin/payments",
    },
  ];
}

function emptyDashboardData(): AdminDashboardData {
  return {
    stats: buildStats({
      totalWorkers: 0,
      activeBookings: 0,
      pendingDocuments: 0,
      pendingPayments: 0,
      openDisputes: 0,
      confirmedRevenue: 0,
    }),
    attentionItems: [],
    recentBookings: [],
    recentWorkers: [],
    confirmedRevenue: formatCurrency(0),
    usingLocalDemoData: true,
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return emptyDashboardData();
  }

  try {
    const [
      workersResult,
      pendingDocumentsResult,
      activeBookingsResult,
      pendingPaymentsResult,
      openDisputesResult,
      revenueResult,
      recentBookingsResult,
      recentWorkersResult,
      pendingWorkersResult,
    ] = await Promise.all([
      supabase.from("worker_profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("verification_documents")
        .select("*", { count: "exact", head: true })
        .eq("status", "submitted"),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "accepted", "in_progress"]),
      supabase
        .from("payments")
        .select("*", { count: "exact", head: true })
        .eq("status", "paid"),
      supabase
        .from("disputes")
        .select("*", { count: "exact", head: true })
        .neq("status", "resolved"),
      supabase
        .from("payments")
        .select("amount")
        .eq("status", "confirmed"),
      supabase
        .from("bookings")
        .select("id, booking_code, service_date, amount, status, payment_status")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("worker_profiles")
        .select("id, full_name, area, city, verification_status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("worker_profiles")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "pending"),
    ]);

    const totalWorkers = workersResult.count ?? 0;
    const pendingDocuments = pendingDocumentsResult.count ?? 0;
    const activeBookings = activeBookingsResult.count ?? 0;
    const pendingPayments = pendingPaymentsResult.count ?? 0;
    const openDisputes = openDisputesResult.count ?? 0;
    const pendingWorkers = pendingWorkersResult.count ?? 0;

    const confirmedRevenue = (revenueResult.data ?? []).reduce(
      (sum, payment) => sum + (payment.amount ?? 0),
      0
    );

    const attentionItems: AdminAttentionItem[] = [];

    if (pendingDocuments > 0) {
      attentionItems.push({
        id: "documents",
        label: `${pendingDocuments} document${pendingDocuments === 1 ? "" : "s"} to review`,
        description: "Worker verification uploads waiting for approval",
        href: "/admin/documents",
        tone: "warning",
      });
    }

    if (pendingPayments > 0) {
      attentionItems.push({
        id: "payments",
        label: `${pendingPayments} payment${pendingPayments === 1 ? "" : "s"} to confirm`,
        description: "Customers submitted proof that needs checking",
        href: "/admin/payments",
        tone: "info",
      });
    }

    if (openDisputes > 0) {
      attentionItems.push({
        id: "disputes",
        label: `${openDisputes} open dispute${openDisputes === 1 ? "" : "s"}`,
        description: "Issues that need a decision from the team",
        href: "/admin/disputes",
        tone: "destructive",
      });
    }

    if (pendingWorkers > 0) {
      attentionItems.push({
        id: "workers",
        label: `${pendingWorkers} worker profile${pendingWorkers === 1 ? "" : "s"} pending`,
        description: "New signups waiting for verification review",
        href: "/admin/workers",
        tone: "warning",
      });
    }

    return {
      stats: buildStats({
        totalWorkers,
        activeBookings,
        pendingDocuments,
        pendingPayments,
        openDisputes,
        confirmedRevenue,
      }),
      attentionItems,
      recentBookings: (recentBookingsResult.data ?? []) as AdminRecentBooking[],
      recentWorkers: (recentWorkersResult.data ?? []) as AdminRecentWorker[],
      confirmedRevenue: formatCurrency(confirmedRevenue),
      usingLocalDemoData: false,
    };
  } catch {
    return emptyDashboardData();
  }
}
