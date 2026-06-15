import type { ServiceCategoryKey, ServiceDetails } from "@/lib/services/catalog";
import {
  categorySlugToKey,
  defaultServiceDetails,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

/** Rebook the same worker with prior service scope when available. */
export function buildBookAgainUrl(
  workerProfileId: string,
  details: ServiceDetails
): string {
  const base = buildBookUrl(details);
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}worker=${encodeURIComponent(workerProfileId)}`;
}

export function serviceDetailsFromBooking(booking: {
  service_details?: ServiceDetails | null;
  category?: { slug?: string | null } | null;
}): ServiceDetails {
  const raw = booking.service_details;
  if (raw && typeof raw === "object" && raw.category) {
    return raw as ServiceDetails;
  }

  const key: ServiceCategoryKey =
    categorySlugToKey(booking.category?.slug ?? "") ?? "nanny";
  return defaultServiceDetails(key);
}

export function canBookAgainWithWorker(status: string): boolean {
  return status === "completed" || status === "cancelled";
}

export function bookAgainLabel(workerName?: string | null): string {
  const first = workerName?.trim().split(/\s+/)[0];
  return first ? `Book again with ${first}` : "Book again with this worker";
}
