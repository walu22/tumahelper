import {
  HERO_CATEGORIES,
  SERVICE_DETAIL_TAB_ORDER,
  type HeroCategoryId,
  type ServiceIconKey,
} from "@/lib/landing/content";
import {
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

export type PricingSnapshotRow = {
  id: HeroCategoryId;
  icon: ServiceIconKey;
  serviceLabel: string;
  visitLabel: string;
  hoursLabel: string;
  priceLabel: string;
  bookHref: string;
  guideHref: string | null;
};

const TAB_META = Object.fromEntries(
  HERO_CATEGORIES.map((category) => [category.id, category])
) as Record<HeroCategoryId, (typeof HERO_CATEGORIES)[number]>;

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

function serviceTableLabel(tabId: HeroCategoryId): string {
  const meta = TAB_META[tabId];
  if (tabId === "short_stay") return "Short-stay";
  if (tabId === "cooking") return "Cooking";
  if (tabId === "housekeeping") return "Housekeeping";
  if (tabId === "laundry") return "Laundry";
  if (tabId === "garden") return "Garden";
  return meta.label;
}

export function getPricingSnapshotRows(): PricingSnapshotRow[] {
  return SERVICE_DETAIL_TAB_ORDER.map((tabId) => {
    const meta = TAB_META[tabId];
    const type = getTypesForTab(tabId)[0];

    if (!type) {
      throw new Error(`Missing featured visit type for ${tabId}`);
    }

    return {
      id: tabId,
      icon: meta.icon,
      serviceLabel: serviceTableLabel(tabId),
      visitLabel: type.label,
      hoursLabel: `~${type.defaultHours}h`,
      priceLabel: `K${type.priceHintMin}–${type.priceHintMax}`,
      bookHref: getBookHref(tabId, type),
      guideHref: tabId === "short_stay" ? null : `/services/${tabId}`,
    };
  });
}
