import Link from "next/link";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-page-section";
import { AdminWorkerDetailPanel } from "@/components/admin/admin-worker-detail-panel";
import { isAdminSupabaseConfigured } from "@/lib/admin/env";
import { getAdminWorkerDetail } from "@/lib/admin/worker-detail-data";
import { Button } from "@/components/ui/button";

export default async function AdminWorkerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdminSupabaseConfigured()) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect Supabase to load worker profiles for review.
        </p>
        <AdminEmptyState
          icon={Users}
          title="Worker details unavailable in demo mode"
          description="Add your Supabase keys to .env.local, then open a worker from the workers list."
        />
        <Button variant="outline" asChild>
          <Link href="/admin/workers">Back to workers</Link>
        </Button>
      </div>
    );
  }

  const worker = await getAdminWorkerDetail(params.id);
  if (!worker) {
    notFound();
  }

  return <AdminWorkerDetailPanel worker={worker} />;
}
