import { AdminDocumentsTable } from "@/components/admin/admin-documents-table";
import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DOCUMENT_STATUS_FILTER } from "@/lib/admin/list-filters";
import { getAdminDocumentsList } from "@/lib/admin/list-data";

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: {
    status?: string;
    page?: string;
  };
}) {
  const result = await getAdminDocumentsList(searchParams);

  return (
    <AdminPageSection
      title="All documents"
      description="Verify worker NRC uploads and supporting documents before profiles go live."
      count={result.total}
    >
      <div className="space-y-4">
        <AdminListControls filters={[DOCUMENT_STATUS_FILTER]} />
        <AdminDocumentsTable documents={result.rows} />
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          pathname="/admin/documents"
          searchParams={searchParams}
        />
      </div>
    </AdminPageSection>
  );
}
