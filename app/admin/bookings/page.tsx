import { AdminBookingsTable } from "@/components/admin/admin-bookings-table";
import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { AdminPagination } from "@/components/admin/admin-pagination";
import {
  BOOKING_PAYMENT_STATUS_FILTER,
  BOOKING_STATUS_FILTER,
} from "@/lib/admin/list-filters";
import { getAdminBookingsList } from "@/lib/admin/list-data";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    status?: string;
    payment_status?: string;
    page?: string;
  };
}) {
  const result = await getAdminBookingsList(searchParams);

  return (
    <AdminPageSection
      title="All bookings"
      description="Track visits, payment status, and booking progress across the platform."
      count={result.total}
    >
      <div className="space-y-4">
        <AdminListControls
          searchPlaceholder="Search by booking code..."
          filters={[BOOKING_STATUS_FILTER, BOOKING_PAYMENT_STATUS_FILTER]}
        />
        <AdminBookingsTable bookings={result.rows} />
        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          pathname="/admin/bookings"
          searchParams={searchParams}
        />
      </div>
    </AdminPageSection>
  );
}
