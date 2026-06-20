import {
  HERO_CATEGORIES,
  SERVICE_DETAIL_TAB_ORDER,
  type HeroCategoryId,
  type ServiceIconKey,
} from "@/lib/landing/content";
import {
  SERVICE_CATALOG,
  getAirbnbCleaningTypes,
  getCookingTypes,
  getGardenTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getNannyTypes,
  getResidentialCleaningTypes,
  defaultServiceDetails,
  type ServiceCategoryKey,
  type ServiceTypeOption,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

export type PricingFeaturedCategory = {
  id: HeroCategoryId;
  icon: ServiceIconKey;
  tabLabel: string;
  categoryLabel: string;
  tagline: string;
  featured: {
    label: string;
    description: string;
    hoursLabel: string;
    priceLabel: string;
    included: string[];
    bookHref: string;
    bookLabel: string;
  };
  guideHref: string | null;
  allTypesLabel: string;
};

const TAB_META = Object.fromEntries(
  HERO_CATEGORIES.map((category) => [category.id, category])
) as Record<HeroCategoryId, (typeof HERO_CATEGORIES)[number]>;

const INCLUDED_PREVIEW_LIMIT = 5;

function getTypesForTab(tabId: HeroCategoryId): ServiceTypeOption[] {
  switch (tabId) {
    case "nanny":
      return getNannyTypes();
    case "cleaning":
      return getResidentialCleaningTypes();
    case "housekeeping":
      return getHousekeepingTypes();
    case "cooking":
      return getCookingTypes();
    case "laundry":
      return getLaundryTypes();
    case "garden":
      return getGardenTypes();
    case "short_stay":
      return getAirbnbCleaningTypes();
  }
}

function getBookHref(tabId: HeroCategoryId, type: ServiceTypeOption): string {
  if (tabId === "short_stay") {
    return `/customer/book/airbnb?type=${type.id}`;
  }
  const category = tabId as ServiceCategoryKey;
  return buildBookUrl({
    ...defaultServiceDetails(category),
    serviceType: type.id,
    durationHours: type.defaultHours,
  });
}

function tabLabel(tabId: HeroCategoryId): string {
  if (tabId === "short_stay") return "Short-stay";
  if (tabId === "cooking") return "Cooking";
  if (tabId === "housekeeping") return "Housekeeping";
  if (tabId === "laundry") return "Laundry";
  if (tabId === "garden") return "Garden";
  return TAB_META[tabId].label;
}

function guideHref(tabId: HeroCategoryId): string | null {
  if (tabId === "short_stay") return "/customer/book/airbnb";
  return `/services/${tabId}`;
}

export function getPricingFeaturedCategories(): PricingFeaturedCategory[] {
  return SERVICE_DETAIL_TAB_ORDER.map((tabId) => {
    const meta = TAB_META[tabId];
    const types = getTypesForTab(tabId);
    const type = types[0];

    if (!type) {
      throw new Error(`Missing featured visit type for ${tabId}`);
    }

    const catalogEntry =
      tabId === "short_stay" ? null : SERVICE_CATALOG[tabId as ServiceCategoryKey];

    return {
      id: tabId,
      icon: meta.icon,
      tabLabel: tabLabel(tabId),
      categoryLabel: meta.label,
      tagline: catalogEntry?.tagline ?? meta.subtitle,
      featured: {
        label: type.label,
        description: type.description,
        hoursLabel: `~${type.defaultHours}h`,
        priceLabel: `K${type.priceHintMin}–${type.priceHintMax}`,
        included: type.included.slice(0, INCLUDED_PREVIEW_LIMIT),
        bookHref: getBookHref(tabId, type),
        bookLabel: `Book ${type.tabLabel ?? type.label}`,
      },
      guideHref: guideHref(tabId),
      allTypesLabel:
        types.length === 1 ? "See full guide" : `All ${types.length} visit types`,
    };
  });
}
