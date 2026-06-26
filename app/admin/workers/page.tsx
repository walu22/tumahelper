import { AdminPageSection } from "@/components/admin/admin-page-section";
import { AdminWorkersTable } from "@/components/admin/admin-workers-table";
import { getAdminWorkersList } from "@/lib/admin/list-data";

export default async function AdminWorkersPage() {
  const workers = await getAdminWorkersList();

  return (
    <AdminPageSection
      title="All workers"
      description="Review profiles, verification level, trust scores, and availability."
      count={workers.length}
    >
      <AdminWorkersTable workers={workers} />
    </AdminPageSection>
  );
}
