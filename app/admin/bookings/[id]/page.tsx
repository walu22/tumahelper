import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { AdminBookingDetailPanel } from "@/components/admin/admin-booking-detail-panel";
import { AdminEmptyState } from "@/components/admin/admin-page-section";
import { isAdminSupabaseConfigured } from "@/lib/admin/env";
import { getAdminBookingDetail } from "@/lib/admin/booking-detail-data";
import { Button } from "@/components/ui/button";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdminSupabaseConfigured()) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect Supabase to load booking details for review.
        </p>
        <AdminEmptyState
          icon={CalendarCheck}
          title="Booking details unavailable in demo mode"
          description="Add your Supabase keys to .env.local, then open a booking from the bookings list."
        />
        <Button variant="outline" asChild>
          <Link href="/admin/bookings">Back to bookings</Link>
        </Button>
      </div>
    );
  }

  const booking = await getAdminBookingDetail(params.id);
  if (!booking) {
    notFound();
  }

  return <AdminBookingDetailPanel booking={booking} />;
}
