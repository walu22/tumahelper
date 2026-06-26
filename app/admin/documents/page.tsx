import { AdminDocumentsTable } from "@/components/admin/admin-documents-table";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { getAdminDocumentsList } from "@/lib/admin/list-data";

export default async function AdminDocumentsPage() {
  const documents = await getAdminDocumentsList();

  return (
    <AdminPageSection
      title="All documents"
      description="Verify worker NRC uploads and supporting documents before profiles go live."
      count={documents.length}
    >
      <AdminDocumentsTable documents={documents} />
    </AdminPageSection>
  );
}
