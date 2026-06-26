"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, FileText, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminEmptyState } from "@/components/admin/admin-page-section";
import type { AdminDocumentRow } from "@/lib/admin/list-data";
import { documentStatusVariant, formatAdminLabel } from "@/lib/admin/status-badges";
import { toast } from "sonner";

function workerName(worker: AdminDocumentRow["worker"]) {
  if (!worker) return "Unknown worker";
  if (Array.isArray(worker)) return worker[0]?.full_name || "Unknown worker";
  return worker.full_name || "Unknown worker";
}

function isReviewable(status: string) {
  return status !== "approved" && status !== "rejected";
}

export function AdminDocumentsTable({ documents }: { documents: AdminDocumentRow[] }) {
  const router = useRouter();
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [openRejectId, setOpenRejectId] = useState<string | null>(null);

  async function handleApprove(id: string) {
    const res = await fetch(`/api/admin/documents/${id}/approve`, { method: "POST" });
    const json = await res.json();

    if (json.success) {
      toast.success("Document approved");
      router.refresh();
      return;
    }

    toast.error(json.error?.message || json.error || "Failed to approve document");
  }

  async function handleReject(id: string) {
    const res = await fetch(`/api/admin/documents/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: rejectReasons[id] || "Not approved" }),
    });
    const json = await res.json();

    if (json.success) {
      toast.success("Document rejected");
      setOpenRejectId(null);
      router.refresh();
      return;
    }

    toast.error(json.error?.message || json.error || "Failed to reject document");
  }

  if (documents.length === 0) {
    return (
      <AdminEmptyState
        icon={FileText}
        title="No documents uploaded yet"
        description="Worker NRC and verification uploads will show up here for review."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-muted-foreground">
              <th className="pb-3 pr-3 font-medium">Worker</th>
              <th className="pb-3 pr-3 font-medium">Type</th>
              <th className="pb-3 pr-3 font-medium">Uploaded</th>
              <th className="pb-3 pr-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-border/50 last:border-0 align-top">
                <td className="py-3 pr-3 font-medium">{workerName(doc.worker)}</td>
                <td className="py-3 pr-3 capitalize text-muted-foreground">
                  {formatAdminLabel(doc.document_type)}
                </td>
                <td className="py-3 pr-3 whitespace-nowrap text-muted-foreground">
                  {new Date(doc.created_at).toLocaleDateString("en-ZM")}
                </td>
                <td className="py-3 pr-3">
                  <Badge variant={documentStatusVariant(doc.status)}>
                    {formatAdminLabel(doc.status)}
                  </Badge>
                </td>
                <td className="py-3">
                  {isReviewable(doc.status) ? (
                    <div className="flex flex-wrap gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(doc.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Approve document</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-red-600 hover:text-red-700"
                        onClick={() =>
                          setOpenRejectId((current) => (current === doc.id ? null : doc.id))
                        }
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Reject document</span>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openRejectId ? (
        <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
          <p className="mb-2 text-sm font-medium">Reject document</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Reason for rejection..."
              value={rejectReasons[openRejectId] || ""}
              onChange={(event) =>
                setRejectReasons((current) => ({
                  ...current,
                  [openRejectId]: event.target.value,
                }))
              }
            />
            <Button variant="destructive" onClick={() => handleReject(openRejectId)}>
              Confirm reject
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
