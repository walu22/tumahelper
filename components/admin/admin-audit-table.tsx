import { ClipboardList } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-page-section";
import type { AdminAuditRow } from "@/lib/admin/list-data";

export function AdminAuditTable({ logs }: { logs: AdminAuditRow[] }) {
  if (logs.length === 0) {
    return (
      <AdminEmptyState
        icon={ClipboardList}
        title="No audit logs found"
        description="Try clearing filters or check back after admin actions are recorded."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/70 text-left text-muted-foreground">
            <th className="pb-3 pr-3 font-medium">Action</th>
            <th className="pb-3 pr-3 font-medium">Entity</th>
            <th className="pb-3 pr-3 font-medium">Admin</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const admin = Array.isArray(log.admin) ? log.admin[0] : log.admin;
            return (
              <tr key={log.id} className="border-b border-border/50 last:border-0">
                <td className="py-3 pr-3 font-medium">{log.action}</td>
                <td className="py-3 pr-3 text-muted-foreground">
                  {log.entity_type} · {log.entity_id.slice(0, 8)}
                </td>
                <td className="py-3 pr-3">{admin?.phone || "System"}</td>
                <td className="py-3 whitespace-nowrap text-muted-foreground">
                  {new Date(log.created_at).toLocaleString("en-ZM")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
