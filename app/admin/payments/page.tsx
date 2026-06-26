import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminPaymentsTable } from "@/components/admin/admin-payments-table";
import { PAYMENT_STATUS_FILTER } from "@/lib/admin/list-filters";
import { getAdminPaymentsList } from "@/lib/admin/list-data";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    status?: string;
    page?: string;
  };
}) {
  const result = await getAdminPaymentsList(searchParams);

  return (
    <AdminPageSection
      title="All payments"
      description="Review Airtel Money proofs and confirm or reject customer payments."
      count={result.total}
    >
      <div className="space-y-4">
        <AdminListControls
          searchPlaceholder="Search by payment code..."
          filters={[PAYMENT_STATUS_FILTER]}
        />
        <AdminPaymentsTable payments={result.rows} />
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          pathname="/admin/payments"
          searchParams={searchParams}
        />
      </div>
    </AdminPageSection>
  );
}
