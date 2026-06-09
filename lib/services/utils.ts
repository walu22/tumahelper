import {
  SERVICE_CATALOG,
  defaultServiceDetails,
  getAddon,
  getServiceType,
  paramToCategoryKey,
  type ServiceCategoryKey,
  type ServiceDetails,
} from "./catalog";

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

export function formatServiceSummary(details: ServiceDetails): string {
  const type = getServiceType(details.category, details.serviceType);
  const parts: string[] = [type?.label ?? details.serviceType];

  if (details.category === "cleaning") {
    parts.push(`${details.bedrooms ?? 3} bed, ${details.bathrooms ?? 2} bath`);
  } else {
    parts.push(
      `${details.children ?? 1} ${details.children === 1 ? "child" : "children"}`
    );
    if (details.childAgeGroups?.length) {
      parts.push(`ages ${details.childAgeGroups.join(", ")}`);
    }
  }

  parts.push(`${details.durationHours}h`);

  if (details.addons.length > 0) {
    const labels = details.addons
      .map((id) => getAddon(details.category, id)?.label ?? id)
      .join(", ");
    parts.push(`+ ${labels}`);
  }

  return parts.join(" · ");
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
