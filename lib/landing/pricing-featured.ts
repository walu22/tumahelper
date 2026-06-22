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
  getHandymanTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getNannyTypes,
  getResidentialCleaningTypes,
  defaultServiceDetails,
  type ServiceCategoryKey,
  type ServiceTypeOption,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

export type PricingVisitType = {
  id: string;
  label: string;
  description: string;
  hoursLabel: string;
  priceLabel: string;
  included: string[];
  bookHref: string;
  bookLabel: string;
};

export type PricingAddon = {
  label: string;
  description: string;
  priceHint: string;
};

export type PricingFeaturedCategory = {
  id: HeroCategoryId;
  icon: ServiceIconKey;
  tabLabel: string;
  categoryLabel: string;
  tagline: string;
  featured: PricingVisitType;
  moreTypes: PricingVisitType[];
  addons: PricingAddon[];
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
    case "handyman":
      return getHandymanTypes();
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
  if (tabId === "handyman") return "Handyman";
  return TAB_META[tabId].label;
}

function toPricingVisitType(
  tabId: HeroCategoryId,
  type: ServiceTypeOption
): PricingVisitType {
  return {
    id: type.id,
    label: type.label,
    description: type.description,
    hoursLabel: `~${type.defaultHours}h`,
    priceLabel: `K${type.priceHintMin}–${type.priceHintMax}`,
    included: type.included,
    bookHref: getBookHref(tabId, type),
    bookLabel: `Book ${type.tabLabel ?? type.label}`,
  };
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

    const visitTypes = types.map((entry) => toPricingVisitType(tabId, entry));

    return {
      id: tabId,
      icon: meta.icon,
      tabLabel: tabLabel(tabId),
      categoryLabel: meta.label,
      tagline: catalogEntry?.tagline ?? meta.subtitle,
      featured: {
        ...toPricingVisitType(tabId, type),
        included: type.included.slice(0, INCLUDED_PREVIEW_LIMIT),
      },
      moreTypes: visitTypes.slice(1),
      addons:
        catalogEntry?.addons.map((addon) => ({
          label: addon.label,
          description: addon.description,
          priceHint: `+ ~K${addon.priceHint}`,
        })) ?? [],
    };
  });
}
