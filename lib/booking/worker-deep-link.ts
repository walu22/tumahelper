import { inferWorkerServiceDetails } from "@/lib/landing/worker-card";
import {
  defaultServiceDetails,
  getServiceType,
  isAirbnbCleaningType,
  normalizeServiceType,
  paramToCategoryKey,
  type ServiceCategoryKey,
  type ServiceDetails,
} from "@/lib/services/catalog";
import { parseServiceDetailsFromParams, resolveFunnelParam } from "@/lib/services/utils";
import type { PublicWorkerProfile } from "@/types";

function resolveCategoryFromParams(
  categoryParam: string | null,
  funnelParam: string | null
): ServiceCategoryKey | null {
  const fromCategory = paramToCategoryKey(categoryParam);
  if (fromCategory) return fromCategory;
  const funnel = resolveFunnelParam(funnelParam);
  return funnel?.category ?? null;
}

/** Build service details from URL params when category or type is present. */
export function resolveServiceDetailsFromSearchParams(
  searchParams: URLSearchParams,
  categoryParam: string | null,
  funnelParam: string | null
): ServiceDetails | null {
  const typeParam = searchParams.get("type");
  const key =
    resolveCategoryFromParams(categoryParam, funnelParam) ??
    (typeParam && isAirbnbCleaningType(normalizeServiceType("cleaning", typeParam))
      ? "cleaning"
      : null);

  if (!key) return null;

  const parsed = parseServiceDetailsFromParams(searchParams);
  const funnel = resolveFunnelParam(funnelParam);
  let details = parsed ?? defaultServiceDetails(key);
  if (funnel?.type) {
    details = { ...details, serviceType: normalizeServiceType(key, funnel.type) };
  }

  const typeOption = getServiceType(key, details.serviceType);
  if (typeOption) details.durationHours = typeOption.defaultHours;

  return details;
}

/** Prefer explicit URL params; otherwise infer from worker skills and category. */
export function resolveServiceDetailsForWorker(
  worker: PublicWorkerProfile,
  searchParams: URLSearchParams,
  categoryParam: string | null,
  funnelParam: string | null
): ServiceDetails {
  return (
    resolveServiceDetailsFromSearchParams(searchParams, categoryParam, funnelParam) ??
    inferWorkerServiceDetails(worker)
  );
}

export function getWorkerSelectionHeading(
  category: ServiceCategoryKey,
  serviceType: string
): string {
  if (category === "nanny") return "Choose your nanny";
  if (category === "housekeeping") return "Choose your housekeeper";
  if (category === "cooking") return "Choose your cook";
  if (category === "handyman") return "Choose your handyman";
  if (category === "laundry") return "Choose your laundry helper";
  if (category === "garden") return "Choose your gardener";
  if (category === "cleaning" && isAirbnbCleaningType(serviceType)) {
    return "Choose your short-stay cleaner";
  }
  return "Choose your cleaner";
}

export const CONFIRM_BOOKING_STEP_LABEL = "Confirm booking";

export const CONFIRM_BOOKING_INTRO = {
  title: "Confirm your booking",
  subtitle:
    "Review the guide price below. After you confirm, you will pay on Airtel Money on the next screen.",
} as const;
