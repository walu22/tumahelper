import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { getCurrentUser } from "@/lib/auth";
import { getRecentBookingShortcuts } from "@/lib/booking/service-picker-helpers";
import { createAuthenticatedServerClient } from "@/lib/supabase-server";

export default async function BookPage() {
  const user = await getCurrentUser();
  let recentBookings: Awaited<ReturnType<typeof getRecentBookingShortcuts>> = [];

  if (user) {
    try {
      const supabase = createAuthenticatedServerClient();
      recentBookings = await getRecentBookingShortcuts(supabase, user.id);
    } catch {
      recentBookings = [];
    }
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BookingWizard recentBookings={recentBookings} />
    </Suspense>
  );
}
