import { AdminBookingsTable } from "@/components/admin/admin-bookings-table";
import { AdminPageSection } from "@/components/admin/admin-page-section";
import { getAdminBookingsList } from "@/lib/admin/list-data";

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookingsList();

  return (
    <AdminPageSection
      title="All bookings"
      description="Track visits, payment status, and booking progress across the platform."
      count={bookings.length}
    >
      <AdminBookingsTable bookings={bookings} />
    </AdminPageSection>
  );
}
