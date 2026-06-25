import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  FileText,
  Users,
} from "lucide-react";
import { AdminAttentionPanel } from "@/components/admin/admin-attention-panel";
import { AdminQuickLinks, AdminStatCards } from "@/components/admin/admin-stat-cards";
import { AdminRecentBookingsTable } from "@/components/admin/admin-recent-bookings";
import { AdminRecentWorkersTable } from "@/components/admin/admin-recent-workers";
import { getAdminDashboardData } from "@/lib/admin/dashboard-data";

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();

  const quickLinks = [
    {
      href: "/admin/workers",
      label: "Review workers",
      description: "Approve profiles and manage listings",
      icon: Users,
    },
    {
      href: "/admin/documents",
      label: "Check documents",
      description: "Verify NRC and supporting uploads",
      icon: FileText,
    },
    {
      href: "/admin/bookings",
      label: "Monitor bookings",
      description: "Track visits and booking status",
      icon: CalendarCheck,
    },
    {
      href: "/admin/payments",
      label: "Confirm payments",
      description: "Review Airtel Money proof uploads",
      icon: CreditCard,
    },
    {
      href: "/admin/analytics",
      label: "View analytics",
      description: "Platform trends and activity",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Operational overview for bookings, workers, payments, and disputes.
        </p>
      </div>

      {data.usingLocalDemoData ? (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100">
          Supabase is not configured yet, so this dashboard is showing empty demo data.
          Copy <code className="rounded bg-background/80 px-1 py-0.5">.env.local.example</code> to{" "}
          <code className="rounded bg-background/80 px-1 py-0.5">.env.local</code> and add your
          project keys to load live admin data.
        </div>
      ) : null}

      <AdminAttentionPanel items={data.attentionItems} />
      <AdminStatCards stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <AdminRecentBookingsTable bookings={data.recentBookings} />
        <div className="space-y-6">
          <AdminQuickLinks links={quickLinks} />
          <AdminRecentWorkersTable workers={data.recentWorkers} />
        </div>
      </div>
    </div>
  );
}
