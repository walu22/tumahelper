"use client";

import { useEffect, useState } from "react";
import {
  HERO_CATEGORY_PANEL_IDS,
  LEGACY_SHORT_STAY_PANEL_ID,
  type HeroCategoryId,
} from "@/lib/landing/content";
import { ServiceCategoryExplorer } from "@/components/booking/service-category-explorer";

const PANEL_ID_TO_CATEGORY: Record<string, HeroCategoryId> = {
  [HERO_CATEGORY_PANEL_IDS.nanny]: "nanny",
  [HERO_CATEGORY_PANEL_IDS.cleaning]: "cleaning",
  [HERO_CATEGORY_PANEL_IDS.housekeeping]: "housekeeping",
  [HERO_CATEGORY_PANEL_IDS.cooking]: "cooking",
  [HERO_CATEGORY_PANEL_IDS.laundry]: "laundry",
  [HERO_CATEGORY_PANEL_IDS.garden]: "garden",
  [HERO_CATEGORY_PANEL_IDS.handyman]: "handyman",
  [HERO_CATEGORY_PANEL_IDS.short_stay]: "short_stay",
  [LEGACY_SHORT_STAY_PANEL_ID]: "short_stay",
};

export const CLEANING_PILLS_ID = HERO_CATEGORY_PANEL_IDS.cleaning;
export const NANNY_PILLS_ID = HERO_CATEGORY_PANEL_IDS.nanny;
export const HOUSEKEEPING_PILLS_ID = HERO_CATEGORY_PANEL_IDS.housekeeping;
export const COOKING_PILLS_ID = HERO_CATEGORY_PANEL_IDS.cooking;
export const SHORT_STAY_PILLS_ID = HERO_CATEGORY_PANEL_IDS.short_stay;
/** @deprecated Use SHORT_STAY_PILLS_ID */
export const AIRBNB_PILLS_ID = SHORT_STAY_PILLS_ID;
export const LAUNDRY_PILLS_ID = HERO_CATEGORY_PANEL_IDS.laundry;
export const GARDEN_PILLS_ID = HERO_CATEGORY_PANEL_IDS.garden;
export const HANDYMAN_PILLS_ID = HERO_CATEGORY_PANEL_IDS.handyman;

export function CategoryScroller() {
  const [hashExpanded, setHashExpanded] = useState<HeroCategoryId | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const category = PANEL_ID_TO_CATEGORY[hash];
    if (category) setHashExpanded(category);
  }, []);

  return (
    <div>
      <p className="text-sm font-semibold text-center text-muted-foreground mb-6">
        Choose the service you need
      </p>
      <ServiceCategoryExplorer
        variant="hero"
        showPopular={false}
        initialExpanded={hashExpanded}
        getBookHref={(category, typeId) => `/customer/book?category=${category}&type=${typeId}`}
        getAirbnbHref={(typeId) => `/customer/book/airbnb?type=${typeId}`}
      />
    </div>
  );
}
