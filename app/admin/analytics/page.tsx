import { AdminAnalyticsOverview } from "@/components/admin/admin-analytics-overview";
import { AdminDemoBanner } from "@/components/admin/admin-page-section";
import { getAdminAnalyticsData } from "@/lib/admin/analytics-data";

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalyticsData();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Platform activity, booking volume, and confirmed payment revenue over the last six months.
      </p>
      {data.usingLocalDemoData ? <AdminDemoBanner /> : null}
      <AdminAnalyticsOverview data={data} />
    </div>
  );
}
