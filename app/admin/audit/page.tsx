import { AdminAuditTable } from "@/components/admin/admin-audit-table";
import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AUDIT_ENTITY_TYPE_FILTER } from "@/lib/admin/list-filters";
import { getAdminAuditList } from "@/lib/admin/list-data";

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    action?: string;
    entity_type?: string;
    page?: string;
  };
}) {
  const result = await getAdminAuditList(searchParams);

  return (
    <AdminPageSection
      title="Recent activity"
      description="Admin actions recorded across workers, bookings, payments, and disputes."
      count={result.total}
    >
      <div className="space-y-4">
        <AdminListControls
          searchPlaceholder="Search action, entity, or ID..."
          filters={[AUDIT_ENTITY_TYPE_FILTER]}
        />
        <AdminAuditTable logs={result.rows} />
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          pathname="/admin/audit"
          searchParams={searchParams}
        />
      </div>
    </AdminPageSection>
  );
}
