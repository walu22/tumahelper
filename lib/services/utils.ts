import {
  CHILD_AGE_GROUPS,
  DURATION_OPTIONS,
  SERVICE_CATALOG,
  defaultServiceDetails,
  getAddon,
  getServiceType,
  paramToCategoryKey,
  type ServiceCategoryKey,
  type ServiceDetails,
} from "./catalog";

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
};

/** Marketing-friendly funnel aliases → book query params */
export const FUNNEL_ALIASES: Record<
  string,
  { category: ServiceCategoryKey; type?: string }
> = {
  "indoor-cleaning": { category: "cleaning", type: "standard" },
  "deep-clean": { category: "cleaning", type: "deep" },
  "move-clean": { category: "cleaning", type: "move" },
  "airbnb-turnover": { category: "cleaning", type: "airbnb" },
  "between-guest-clean": { category: "cleaning", type: "airbnb" },
  "between-guest": { category: "cleaning", type: "airbnb" },
  "airbnb": { category: "cleaning", type: "airbnb" },
  babysitting: { category: "nanny", type: "babysitting" },
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

  if (details.category === "cleaning") {
    const beds = details.bedrooms ?? 3;
    const baths = details.bathrooms ?? 2;
    hours += Math.max(0, beds - 2) * 0.5;
    hours += Math.max(0, baths - 1) * 0.5;
  } else {
    hours += Math.max(0, (details.children ?? 1) - 1) * 0.5;
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

  if (details.category === "cleaning") {
    const extraBeds = Math.max(0, (details.bedrooms ?? 3) - 2);
    min += extraBeds * 50;
    max += extraBeds * 80;
    const extraBaths = Math.max(0, (details.bathrooms ?? 2) - 1);
    min += extraBaths * 40;
    max += extraBaths * 60;
  } else {
    const extraChildren = Math.max(0, (details.children ?? 1) - 1);
    min += extraChildren * 60;
    max += extraChildren * 100;
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

export function getServiceScopeRows(details: ServiceDetails): ServiceScopeRow[] {
  const rows: ServiceScopeRow[] = [];

  if (details.category === "cleaning") {
    rows.push({
      label: "Home",
      value: `${details.bedrooms ?? 3} bed · ${details.bathrooms ?? 2} bath`,
    });
  } else {
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
  }

  rows.push({
    label: "Duration",
    value: `${details.durationHours} hour${details.durationHours === 1 ? "" : "s"}`,
  });

  if (details.addons.length > 0) {
    const labels = details.addons
      .map((id) => getAddon(details.category, id)?.label ?? id)
      .join(", ");
    rows.push({ label: "Extras", value: labels });
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

  return `/customer/book?${params.toString()}`;
}

export function parseServiceDetailsFromParams(
  searchParams: URLSearchParams
): ServiceDetails | null {
  const category = paramToCategoryKey(searchParams.get("category"));
  if (!category) return null;

  const base = defaultServiceDetails(category);
  const type = searchParams.get("type");
  if (type) base.serviceType = type;

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

  return base;
}

export function mergeServiceDetails(
  category: ServiceCategoryKey,
  parsed: ServiceDetails | null
): ServiceDetails {
  return parsed ?? defaultServiceDetails(category);
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
