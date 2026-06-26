import type { SupabaseClient } from "@supabase/supabase-js";
import { getBookingPageTitle } from "@/lib/booking/shared-flow";
import { attachBookAgainHrefs } from "@/lib/bookings/book-again-enrich";
import { serviceDetailsFromBooking } from "@/lib/bookings/book-again";
import {
  getServiceType,
  type ServiceCategoryKey,
  type ServiceDetails,
} from "@/lib/services/catalog";

export type RecentBookingShortcut = {
  id: string;
  bookingCode: string;
  href: string;
  serviceLabel: string;
  workerName: string | null;
};

export function formatServicePriceHint(category: ServiceCategoryKey, typeId: string): string | null {
  const type = getServiceType(category, typeId);
  if (!type) return null;
  return `From K${type.priceHintMin}`;
}

export function parseBookServiceHref(href: string): {
  category: ServiceCategoryKey;
  typeId: string;
} | null {
  try {
    const url = new URL(href, "https://tumahelper.local");
    if (url.pathname === "/customer/book/airbnb") {
      const typeId = url.searchParams.get("type");
      return typeId ? { category: "cleaning", typeId } : null;
    }
    if (url.pathname !== "/customer/book") return null;

    const category = url.searchParams.get("category") as ServiceCategoryKey | null;
    const typeId = url.searchParams.get("type");
    if (!category || !typeId) return null;
    return { category, typeId };
  } catch {
    return null;
  }
}

function serviceLabelFromBooking(booking: {
  service_details?: ServiceDetails | null;
  category?: { slug?: string | null } | null;
}): string {
  const details = serviceDetailsFromBooking(booking);
  const type = getServiceType(details.category, details.serviceType);
  if (type?.tabLabel || type?.label) return type.tabLabel ?? type.label;
  return getBookingPageTitle(details.category, details.serviceType);
}

export async function getRecentBookingShortcuts(
  supabase: SupabaseClient,
  customerId: string,
  limit = 3
): Promise<RecentBookingShortcut[]> {
  const { data: bookingRows } = await supabase
    .from("bookings")
    .select(
      "id, booking_code, status, worker_id, category_id, service_details, worker:worker_id(full_name)"
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(8);

  if (!bookingRows?.length) return [];

  const normalized = bookingRows.map((booking) => ({
    ...booking,
    worker: Array.isArray(booking.worker) ? booking.worker[0] : booking.worker,
  }));

  const categoryIds = Array.from(
    new Set(
      normalized
        .map((booking) => booking.category_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    )
  );

  let categories: { id: string; slug: string }[] = [];
  if (categoryIds.length) {
    const { data } = await supabase
      .from("service_categories")
      .select("id, slug")
      .in("id", categoryIds);
    categories = data ?? [];
  }

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const withCategories = normalized.map((booking) => ({
    ...booking,
    category: booking.category_id ? categoryById.get(booking.category_id) ?? null : null,
  }));

  const enriched = await attachBookAgainHrefs(supabase, withCategories);

  return enriched
    .filter((booking) => booking.bookAgainHref)
    .slice(0, limit)
    .map((booking) => ({
      id: booking.id,
      bookingCode: booking.booking_code,
      href: booking.bookAgainHref!,
      serviceLabel: serviceLabelFromBooking(booking),
      workerName:
        (Array.isArray(booking.worker) ? booking.worker[0]?.full_name : booking.worker?.full_name) ??
        null,
    }));
}
