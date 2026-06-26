import Link from "next/link";
import { Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerificationBadge } from "@/components/verification/verification-badge";
import { AdminEmptyState } from "@/components/admin/admin-page-section";
import type { AdminWorkerRow } from "@/lib/admin/list-data";
import { formatAdminLabel, workerAvailabilityVariant } from "@/lib/admin/status-badges";

function trustScoreClass(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

export function AdminWorkersTable({ workers }: { workers: AdminWorkerRow[] }) {
  if (workers.length === 0) {
    return (
      <AdminEmptyState
        icon={Users}
        title="No workers yet"
        description="Worker signups will appear here once profiles are created in Supabase."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/70 text-left text-muted-foreground">
            <th className="pb-3 pr-3 font-medium">Name</th>
            <th className="pb-3 pr-3 font-medium">Category</th>
            <th className="pb-3 pr-3 font-medium">Location</th>
            <th className="pb-3 pr-3 font-medium">Verification</th>
            <th className="pb-3 pr-3 font-medium">Trust</th>
            <th className="pb-3 pr-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.id} className="border-b border-border/50 last:border-0">
              <td className="py-3 pr-3">
                <div className="font-medium">{worker.full_name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatAdminLabel(worker.verification_status)}
                </div>
              </td>
              <td className="py-3 pr-3 capitalize">{formatAdminLabel(worker.category)}</td>
              <td className="py-3 pr-3 text-muted-foreground">
                {worker.area}, {worker.city}
              </td>
              <td className="py-3 pr-3">
                <VerificationBadge level={worker.verification_level || "none"} size="sm" />
              </td>
              <td className="py-3 pr-3">
                <span className={`font-mono font-bold ${trustScoreClass(worker.trust_score)}`}>
                  {worker.trust_score}
                </span>
              </td>
              <td className="py-3 pr-3">
                <Badge variant={workerAvailabilityVariant(worker.availability_status)}>
                  {formatAdminLabel(worker.availability_status)}
                </Badge>
              </td>
              <td className="py-3">
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                  <Link href={`/admin/workers/${worker.id}`}>
                    <Shield className="h-4 w-4" />
                    <span className="sr-only">Review worker</span>
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
