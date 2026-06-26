import { AdminDisputesTable } from "@/components/admin/admin-disputes-table";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { getAdminDisputesList } from "@/lib/admin/list-data";

export default async function AdminDisputesPage() {
  const disputes = await getAdminDisputesList();

  return (
    <AdminPageSection
      title="All disputes"
      description="Review issues raised by customers or workers and record the resolution."
      count={disputes.length}
    >
      <AdminDisputesTable disputes={disputes} />
    </AdminPageSection>
  );
}
