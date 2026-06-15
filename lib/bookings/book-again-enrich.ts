import type { SupabaseClient } from "@supabase/supabase-js";
import type { ServiceDetails } from "@/lib/services/catalog";
import {
  buildBookAgainUrl,
  canBookAgainWithWorker,
  serviceDetailsFromBooking,
} from "@/lib/bookings/book-again";

interface BookingRow {
  id: string;
  worker_id: string;
  status: string;
  service_details?: ServiceDetails | null;
  category_id?: string | null;
}

export async function attachBookAgainHrefs<T extends BookingRow>(
  supabase: SupabaseClient,
  bookings: T[]
): Promise<(T & { bookAgainHref: string | null })[]> {
  if (bookings.length === 0) return [];

  const workerUserIds = Array.from(
    new Set(bookings.map((b) => b.worker_id).filter(Boolean))
  );
  const categoryIds = Array.from(
    new Set(
      bookings
        .map((b) => b.category_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    )
  );

  let profiles: { id: string; user_id: string; full_name: string }[] = [];
  if (workerUserIds.length) {
    const { data } = await supabase
      .from("worker_profiles")
      .select("id, user_id, full_name")
      .in("user_id", workerUserIds);
    profiles = data ?? [];
  }

  let categories: { id: string; slug: string }[] = [];
  if (categoryIds.length) {
    const { data } = await supabase
      .from("service_categories")
      .select("id, slug")
      .in("id", categoryIds);
    categories = data ?? [];
  }

  const profileByUserId = new Map(profiles.map((p) => [p.user_id, p]));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return bookings.map((booking) => {
    const profile = profileByUserId.get(booking.worker_id);
    const category = booking.category_id
      ? categoryById.get(booking.category_id)
      : null;

    const bookAgainHref =
      profile?.id && canBookAgainWithWorker(booking.status)
        ? buildBookAgainUrl(
            profile.id,
            serviceDetailsFromBooking({
              service_details: booking.service_details,
              category: category ? { slug: category.slug } : null,
            })
          )
        : null;

    return { ...booking, bookAgainHref };
  });
}
