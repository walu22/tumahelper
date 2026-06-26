import { AdminDisputesTable } from "@/components/admin/admin-disputes-table";
import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DISPUTE_STATUS_FILTER } from "@/lib/admin/list-filters";
import { getAdminDisputesList } from "@/lib/admin/list-data";

export default async function AdminDisputesPage({
  searchParams,
}: {
  searchParams: {
    status?: string;
    page?: string;
  };
}) {
  const result = await getAdminDisputesList(searchParams);

  return (
    <AdminPageSection
      title="All disputes"
      description="Review issues raised by customers or workers and record the resolution."
      count={result.total}
    >
      <div className="space-y-4">
        <AdminListControls filters={[DISPUTE_STATUS_FILTER]} />
        <AdminDisputesTable disputes={result.rows} />
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          pathname="/admin/disputes"
          searchParams={searchParams}
        />
      </div>
    </AdminPageSection>
  );
}
