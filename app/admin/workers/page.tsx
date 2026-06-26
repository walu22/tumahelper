import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminWorkersTable } from "@/components/admin/admin-workers-table";
import { WORKER_VERIFICATION_STATUS_FILTER } from "@/lib/admin/list-filters";
import { getAdminWorkersList } from "@/lib/admin/list-data";

export default async function AdminWorkersPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    verification_status?: string;
    page?: string;
  };
}) {
  const result = await getAdminWorkersList(searchParams);

  return (
    <AdminPageSection
      title="All workers"
      description="Review profiles, verification level, trust scores, and availability."
      count={result.total}
    >
      <div className="space-y-4">
        <AdminListControls
          searchPlaceholder="Search by worker name..."
          filters={[WORKER_VERIFICATION_STATUS_FILTER]}
        />
        <AdminWorkersTable workers={result.rows} />
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          pathname="/admin/workers"
          searchParams={searchParams}
        />
      </div>
    </AdminPageSection>
  );
}
