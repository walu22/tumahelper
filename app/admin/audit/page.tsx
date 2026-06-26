import { ClipboardList } from "lucide-react";
import { AdminEmptyState, AdminPageSection } from "@/components/admin/admin-page-section";
import { getAdminSupabaseClient } from "@/lib/admin/supabase";

async function getAuditLogs() {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return [];

  try {
    const { data: logs } = await supabase
      .from("audit_logs")
      .select("*, admin:admin_id(phone)")
      .order("created_at", { ascending: false })
      .limit(50);

    return logs || [];
  } catch {
    return [];
  }
}

export default async function AdminAuditPage() {
  const logs = await getAuditLogs();

  return (
    <AdminPageSection
      title="Recent activity"
      description="Admin actions recorded across workers, bookings, payments, and disputes."
      count={logs.length}
    >
      {logs.length === 0 ? (
        <AdminEmptyState
          icon={ClipboardList}
          title="No audit logs yet"
          description="Actions you take in admin will be listed here."
        />
      ) : (
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
              {logs.map((log: {
                id: string;
                action: string;
                entity_type: string;
                entity_id: string;
                created_at: string;
                admin?: { phone?: string } | Array<{ phone?: string }> | null;
              }) => {
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
      )}
    </AdminPageSection>
  );
}
