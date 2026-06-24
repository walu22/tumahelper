import {
  CHILD_AGE_GROUPS,
  DURATION_OPTIONS,
  SERVICE_CATALOG,
  TURNOVER_FREQUENCY_OPTIONS,
  defaultServiceDetails,
  getAddon,
  getLinenPreferences,
  getServiceType,
  isAirbnbCleaningType,
  normalizeServiceType,
  paramToCategoryKey,
  sanitizeAddons,
  type ServiceCategoryKey,
  type ServiceDetails,
  type TurnoverFrequency,
} from "./catalog";
import { formatLinenPreferences } from "@/lib/booking/airbnb-flow";

export type AddonSectionCopy = {
  /** Scope step heading for the duty/add-on picker */
  pickerTitle: string;
  /** Helper line under the picker heading */
  pickerSubtitle: string;
  /** Short label in booking summary rows */
  summaryLabel: string;
  /** Service selection card heading (type tabs) */
  previewTitle: string;
};

/** Customer-facing labels for optional extras vs duty pickers. */
export function getAddonSectionCopy(category: ServiceCategoryKey): AddonSectionCopy {
  switch (category) {
    case "housekeeping":
      return {
        pickerTitle: "Duties for this visit",
        pickerSubtitle: "Select what you want covered during the visit.",
        summaryLabel: "Duties",
        previewTitle: "Duties for this visit",
      };
    case "cooking":
      return {
        pickerTitle: "Meals and kitchen tasks",
        pickerSubtitle: "Select what the cook should prepare or handle in the kitchen.",
        summaryLabel: "Duties",
        previewTitle: "Meals and kitchen tasks",
      };
    default:
      return {
        pickerTitle: "Optional add-ons",
        pickerSubtitle: "Select anything extra you need on the job details step.",
        summaryLabel: "Add-ons",
        previewTitle: "Optional add-ons",
      };
  }
}

/** Hours each add-on typically adds to a visit */
const ADDON_HOUR_INCREMENT: Record<string, number> = {
  laundry: 1.5,
  ironing: 1,
  oven: 0.5,
  fridge: 0.5,
  windows: 1,
  cabinets: 1,
  meal_prep: 0.5,
  homework: 0.5,
  light_tidying: 0.5,
  school_pickup: 0.5,
  dishes: 0.5,
  bedding: 0.5,
  balcony: 0.5,
  supplies: 0,
  outside_sweep: 0.5,
  tidying: 0.25,
};

/** Marketing-friendly funnel aliases → book query params */
export const FUNNEL_ALIASES: Record<
  string,
  { category: ServiceCategoryKey; type?: string }
> = {
  "indoor-cleaning": { category: "cleaning", type: "standard" },
  "spring-cleaning": { category: "cleaning", type: "spring" },
  "apartment-cleaning": { category: "cleaning", type: "apartment" },
  "deep-clean": { category: "cleaning", type: "deep" },
  "garage-cleaning": { category: "cleaning", type: "garage" },
  "move-clean": { category: "cleaning", type: "move" },
  "move-out": { category: "cleaning", type: "move" },
  "airbnb-turnover": { category: "cleaning", type: "guest_checkout" },
  "between-guest-clean": { category: "cleaning", type: "guest_checkout" },
  "between-guest": { category: "cleaning", type: "guest_checkout" },
  airbnb: { category: "cleaning", type: "guest_checkout" },
  babysitting: { category: "nanny", type: "babysitter" },
  babysitter: { category: "nanny", type: "babysitter" },
  "after-school": { category: "nanny", type: "after_school" },
};

export function resolveFunnelParam(
  funnel: string | null
): { category: ServiceCategoryKey; type?: string } | null {
  if (!funnel) return null;
  const key = funnel.toLowerCase().replace(/\s+/g, "-");
  return FUNNEL_ALIASES[key] ?? null;
}

export function suggestDuration(details: ServiceDetails): number {
  const type = getServiceType(details.category, details.serviceType);
  if (!type) return 4;

  let hours = type.defaultHours;

  if (details.category === "cleaning" && details.serviceType !== "garage") {
    const beds = details.bedrooms ?? 3;
    const baths = details.bathrooms ?? 2;
    hours += Math.max(0, beds - 2) * 0.5;
    hours += Math.max(0, baths - 1) * 0.5;
  } else if (details.category === "nanny") {
    hours += Math.max(0, (details.children ?? 1) - 1) * 0.5;
  } else if (details.category === "housekeeping" || details.category === "cooking") {
    hours += Math.max(0, details.addons.length - 2) * 0.25;
  } else if (details.category === "handyman") {
    if (details.addons.includes("extra_hour")) hours += 1;
    if (details.addons.includes("second_helper")) hours += 1;
    if (details.serviceType === "home_maintenance" && details.durationHours >= 8) {
      hours = 8;
    }
  }

  for (const addonId of details.addons) {
    hours += ADDON_HOUR_INCREMENT[addonId] ?? 0.5;
  }

  hours = Math.max(DURATION_OPTIONS[0], Math.min(DURATION_OPTIONS[DURATION_OPTIONS.length - 1], hours));

  return DURATION_OPTIONS.reduce((best, opt) =>
    Math.abs(opt - hours) < Math.abs(best - hours) ? opt : best
  );
}

export function suggestPrice(details: ServiceDetails): {
  min: number;
  max: number;
  typical: number;
} {
  const type = getServiceType(details.category, details.serviceType);
  if (!type) return { min: 300, max: 600, typical: 450 };

  let min = type.priceHintMin;
  let max = type.priceHintMax;

  if (details.category === "cleaning" && details.serviceType !== "garage") {
    const extraBeds = Math.max(0, (details.bedrooms ?? 3) - 2);
    min += extraBeds * 50;
    max += extraBeds * 80;
    const extraBaths = Math.max(0, (details.bathrooms ?? 2) - 1);
    min += extraBaths * 40;
    max += extraBaths * 60;
  } else if (details.category === "nanny") {
    const extraChildren = Math.max(0, (details.children ?? 1) - 1);
    min += extraChildren * 60;
    max += extraChildren * 100;
  } else if (details.category === "housekeeping" || details.category === "cooking") {
    const dutyCount = details.addons.length;
    min += dutyCount * 25;
    max += dutyCount * 45;
  } else if (details.category === "handyman") {
    const addonCount = details.addons.filter((id) => id !== "inspection_only").length;
    min += addonCount * 30;
    max += addonCount * 50;
  }

  const hourFactor = details.durationHours / type.defaultHours;
  min = Math.round(min * Math.max(0.75, hourFactor));
  max = Math.round(max * Math.max(0.75, hourFactor));

  for (const addonId of details.addons) {
    const addon = getAddon(details.category, addonId);
    if (addon) {
      min += addon.priceHint;
      max += addon.priceHint;
    }
  }

  const typical = Math.round((min + max) / 2);
  return { min, max, typical };
}

export function formatAgeGroupsSummary(ageIds: string[]): string {
  if (!ageIds.length) return "";

  const counts = new Map<string, number>();
  for (const id of ageIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([id, count]) => {
      const label = CHILD_AGE_GROUPS.find((g) => g.id === id)?.label ?? id;
      const short = label.replace(/\s*\([^)]+\)$/, "");
      return count > 1 ? `${short} ×${count}` : short;
    })
    .join(", ");
}

/** Labelled rows for booking summary panels */
export interface ServiceScopeRow {
  label: string;
  value: string;
}

export function formatTurnoverFrequency(frequency: TurnoverFrequency | undefined): string {
  if (!frequency) return "One-time clean";
  return TURNOVER_FREQUENCY_OPTIONS.find((o) => o.id === frequency)?.label ?? "One-time clean";
}

export function getServiceScopeRows(details: ServiceDetails): ServiceScopeRow[] {
  const rows: ServiceScopeRow[] = [];

  if (details.category === "cleaning") {
    if (details.serviceType === "garage") {
      rows.push({ label: "Space", value: "Garage & outside areas" });
    } else {
      rows.push({
        label: isAirbnbCleaningType(details.serviceType) ? "Property" : "Home",
        value: `${details.bedrooms ?? 3} bed · ${details.bathrooms ?? 2} bath`,
      });
    }
    if (isAirbnbCleaningType(details.serviceType) && details.frequency) {
      rows.push({
        label: "Frequency",
        value: formatTurnoverFrequency(details.frequency),
      });
    }
    if (isAirbnbCleaningType(details.serviceType)) {
      const linen = formatLinenPreferences(getLinenPreferences(details));
      if (linen) {
        rows.push({ label: "Linen", value: linen });
      }
    }
  } else if (details.category === "nanny") {
    const count = details.children ?? 1;
    const ages = (details.childAgeGroups ?? []).slice(0, count);
    const ageSummary = formatAgeGroupsSummary(ages);
    rows.push({
      label: "Children",
      value: count === 1 ? "1 child" : `${count} children`,
    });
    if (ageSummary) {
      rows.push({ label: "Ages", value: ageSummary });
    }
  } else if (details.category === "housekeeping") {
    const type = getServiceType(details.category, details.serviceType);
    if (type) {
      rows.push({ label: "Visit", value: type.label });
    }
  } else {
    const type = getServiceType(details.category, details.serviceType);
    if (type) {
      rows.push({ label: "Service", value: type.label });
    }
  }

  rows.push({
    label: "Duration",
    value: `${details.durationHours} hour${details.durationHours === 1 ? "" : "s"}`,
  });

  if (details.addons.length > 0) {
    const { summaryLabel } = getAddonSectionCopy(details.category);
    const labels = details.addons
      .map((id) => getAddon(details.category, id)?.label ?? id)
      .join(", ");
    rows.push({ label: summaryLabel, value: labels });
  }

  return rows;
}

/** Readable scope bullets for the booking summary (no service type label) */
export function getServiceScopeLines(details: ServiceDetails): string[] {
  return getServiceScopeRows(details).map((row) => `${row.label}: ${row.value}`);
}

export function formatServiceScope(details: ServiceDetails): string {
  return getServiceScopeRows(details)
    .map((row) => `${row.label}: ${row.value}`)
    .join(" · ");
}

export function formatServiceSummary(details: ServiceDetails): string {
  const type = getServiceType(details.category, details.serviceType);
  const scope = getServiceScopeRows(details)
    .map((row) => row.value)
    .join(" · ");
  return [type?.label ?? details.serviceType, scope].filter(Boolean).join(" · ");
}

export function buildBookUrl(details: ServiceDetails): string {
  const entry = SERVICE_CATALOG[details.category];
  const params = new URLSearchParams();
  params.set("category", entry.bookParam);
  params.set("type", details.serviceType);
  params.set("hours", String(details.durationHours));

  if (details.category === "cleaning") {
    params.set("bedrooms", String(details.bedrooms ?? 3));
    params.set("bathrooms", String(details.bathrooms ?? 2));
  } else {
    params.set("children", String(details.children ?? 1));
    if (details.childAgeGroups?.length) {
      params.set("ages", details.childAgeGroups.join(","));
    }
  }

  if (details.addons.length > 0) {
    params.set("addons", details.addons.join(","));
  }

  if (details.category === "cleaning" && isAirbnbCleaningType(details.serviceType) && details.frequency) {
    params.set("frequency", details.frequency);
  }

  return `/customer/book?${params.toString()}`;
}

export function parseServiceDetailsFromParams(
  searchParams: URLSearchParams
): ServiceDetails | null {
  const category = paramToCategoryKey(searchParams.get("category"));
  if (!category) return null;

  const base = defaultServiceDetails(category);
  const type = searchParams.get("type");
  if (type) base.serviceType = normalizeServiceType(category, type);

  const hours = searchParams.get("hours");
  if (hours) base.durationHours = parseInt(hours, 10) || base.durationHours;

  if (category === "cleaning") {
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    if (bedrooms) base.bedrooms = parseInt(bedrooms, 10) || base.bedrooms;
    if (bathrooms) base.bathrooms = parseInt(bathrooms, 10) || base.bathrooms;
  } else {
    const children = searchParams.get("children");
    if (children) base.children = parseInt(children, 10) || base.children;
    const ages = searchParams.get("ages");
    if (ages) base.childAgeGroups = ages.split(",").filter(Boolean);
  }

  const addons = searchParams.get("addons");
  if (addons) base.addons = addons.split(",").filter(Boolean);
  base.addons = sanitizeAddons(category, base.serviceType, base.addons);

  if (category === "cleaning" && isAirbnbCleaningType(base.serviceType)) {
    const frequency = searchParams.get("frequency");
    if (
      frequency === "once" ||
      frequency === "per_checkout" ||
      frequency === "weekly" ||
      frequency === "every_2_weeks"
    ) {
      base.frequency = frequency;
    } else {
      base.frequency = "once";
    }
  }

  return base;
}

export function mergeServiceDetails(
  category: ServiceCategoryKey,
  parsed: ServiceDetails | null
): ServiceDetails {
  return parsed ?? defaultServiceDetails(category);
}

export function getCleaningDurationHelperText(hours: number): string {
  return getDurationHelperText("cleaning", hours);
}

export function getDurationHelperText(category: ServiceCategoryKey, hours: number): string {
  if (category === "cleaning") {
    if (hours <= 2) return "Best for a small apartment or light touch-up cleaning.";
    if (hours === 3) return "Good for an apartment or small home with kitchen, bathroom, and floors.";
    if (hours === 4) return "Good for a 2–3 bedroom home with kitchen, bathrooms, floors, and general tidying.";
    if (hours <= 7) return "Good for a larger home or more detailed cleaning.";
    return "Best for spring cleaning, move-in/move-out cleaning, or full-day cleaning.";
  }
  if (category === "nanny") {
    if (hours <= 3) return "Great for a short outing or afternoon errands.";
    if (hours <= 5) return "Covers a school run plus homework or afternoon play.";
    if (hours <= 8) return "A full day of childcare while you're at work.";
    return "Extended care for a long workday or overnight.";
  }
  if (category === "housekeeping") {
    if (hours <= 3) return "A quick session for light duties — dishes, sweeping, laundry.";
    if (hours <= 5) return "Enough time for cooking, cleaning, and one or two extra duties.";
    if (hours <= 8) return "A full day — ideal for a thorough clean, cooking, and laundry.";
    return "Extended help for larger households or event preparation.";
  }
  if (category === "cooking") {
    if (hours <= 3) return "Enough to prepare one to two meals.";
    if (hours <= 5) return "Covers meal prep, cooking, and kitchen cleanup.";
    return "A full day of cooking — great for events or weekly meal-prep batches.";
  }
  if (category === "garden") {
    if (hours <= 3) return "Good for lawn mowing and light trimming.";
    if (hours <= 5) return "Covers mowing, hedge trimming, and weeding.";
    return "A full garden overhaul — great for large yards or seasonal cleanup.";
  }
  if (category === "laundry") {
    if (hours <= 3) return "Enough for a few loads — wash, dry, and fold.";
    if (hours <= 5) return "Covers a full household's laundry including ironing.";
    return "Extended session for large households or deep linen care.";
  }
  // Fallback for handyman and others
  if (hours <= 3) return "Good for a single small task.";
  if (hours <= 5) return "Enough for a couple of tasks or one medium job.";
  return "A full session for larger projects or multiple tasks.";
}

export function nannyChildAgesComplete(details: ServiceDetails): boolean {
  if (details.category !== "nanny") return true;
  const count = details.children ?? 1;
  const ages = details.childAgeGroups ?? [];
  if (count === 1) {
    return typeof ages[0] === "string" && ages[0].length > 0;
  }
  return (
    ages.length >= count &&
    ages.slice(0, count).every((age) => typeof age === "string" && age.length > 0)
  );
}
