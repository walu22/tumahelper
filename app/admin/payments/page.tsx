import { AdminPageSection } from "@/components/admin/admin-page-section";
import { AdminPaymentsTable } from "@/components/admin/admin-payments-table";
import { getAdminPaymentsList } from "@/lib/admin/list-data";

export default async function AdminPaymentsPage() {
  const payments = await getAdminPaymentsList();

  return (
    <AdminPageSection
      title="All payments"
      description="Review Airtel Money proofs and confirm or reject customer payments."
      count={payments.length}
    >
      <AdminPaymentsTable payments={payments} />
    </AdminPageSection>
  );
}
