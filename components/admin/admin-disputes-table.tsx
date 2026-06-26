"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminEmptyState } from "@/components/admin/admin-page-section";
import type { AdminDisputeRow } from "@/lib/admin/list-data";
import { disputeStatusVariant, formatAdminLabel } from "@/lib/admin/status-badges";
import { toast } from "sonner";

const RESOLUTION_ACTIONS = [
  "refund",
  "partial_refund",
  "worker_suspension",
  "account_ban",
  "no_action",
] as const;

function isResolvable(status: string) {
  return status === "open" || status === "under_review";
}

export function AdminDisputesTable({ disputes }: { disputes: AdminDisputeRow[] }) {
  const router = useRouter();
  const [resolution, setResolution] = useState<Record<string, string>>({});
  const [resolutionAction, setResolutionAction] = useState<Record<string, string>>({});
  const [activeDisputeId, setActiveDisputeId] = useState<string | null>(null);

  async function handleResolve(id: string) {
    if (!resolution[id]?.trim() || !resolutionAction[id]) {
      toast.error("Resolution notes and action are required");
      return;
    }

    const res = await fetch(`/api/admin/disputes/${id}/resolve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resolution: resolution[id],
        resolutionAction: resolutionAction[id],
      }),
    });
    const json = await res.json();

    if (json.success) {
      toast.success("Dispute resolved");
      setActiveDisputeId(null);
      router.refresh();
      return;
    }

    toast.error(json.error?.message || json.error || "Failed to resolve dispute");
  }

  if (disputes.length === 0) {
    return (
      <AdminEmptyState
        icon={Scale}
        title="No disputes raised"
        description="Customer or worker disputes will appear here when they need a decision."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-muted-foreground">
              <th className="pb-3 pr-3 font-medium">Type</th>
              <th className="pb-3 pr-3 font-medium">Description</th>
              <th className="pb-3 pr-3 font-medium">Status</th>
              <th className="pb-3 pr-3 font-medium">Raised</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => (
              <tr key={dispute.id} className="border-b border-border/50 last:border-0 align-top">
                <td className="py-3 pr-3 capitalize">{formatAdminLabel(dispute.dispute_type)}</td>
                <td className="max-w-xs py-3 pr-3 text-muted-foreground">
                  <p className="line-clamp-2">{dispute.description}</p>
                </td>
                <td className="py-3 pr-3">
                  <Badge variant={disputeStatusVariant(dispute.status)}>
                    {formatAdminLabel(dispute.status)}
                  </Badge>
                </td>
                <td className="py-3 pr-3 whitespace-nowrap text-muted-foreground">
                  {new Date(dispute.created_at).toLocaleDateString("en-ZM")}
                </td>
                <td className="py-3">
                  {isResolvable(dispute.status) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setActiveDisputeId((current) =>
                          current === dispute.id ? null : dispute.id
                        )
                      }
                    >
                      Resolve
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {dispute.resolution_action
                        ? formatAdminLabel(dispute.resolution_action)
                        : "Closed"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeDisputeId ? (
        <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
          <p className="mb-3 text-sm font-medium">Resolve dispute</p>
          <div className="space-y-3">
            <Input
              placeholder="Resolution notes..."
              value={resolution[activeDisputeId] || ""}
              onChange={(event) =>
                setResolution((current) => ({
                  ...current,
                  [activeDisputeId]: event.target.value,
                }))
              }
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={resolutionAction[activeDisputeId] || ""}
                onChange={(event) =>
                  setResolutionAction((current) => ({
                    ...current,
                    [activeDisputeId]: event.target.value,
                  }))
                }
              >
                <option value="">Select action</option>
                {RESOLUTION_ACTIONS.map((action) => (
                  <option key={action} value={action}>
                    {formatAdminLabel(action)}
                  </option>
                ))}
              </select>
              <Button
                className="rounded-full"
                onClick={() => handleResolve(activeDisputeId)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm resolution
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
