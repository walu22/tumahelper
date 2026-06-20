"use client";

import { useEffect, useState } from "react";
import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import { NannyTypeTabs } from "@/components/booking/nanny-type-tabs";
import { AirbnbTypeTabs } from "@/components/booking/airbnb-type-tabs";
import { HousekeepingTypeTabs } from "@/components/booking/housekeeping-type-tabs";
import { LaundryTypeTabs } from "@/components/booking/laundry-type-tabs";
import { GardenTypeTabs } from "@/components/booking/garden-type-tabs";
import { ServiceIcon } from "@/components/brand/service-icons";
import {
  HERO_CATEGORIES,
  HERO_CATEGORY_PANEL_IDS,
  LEGACY_SHORT_STAY_PANEL_ID,
  type HeroCategoryId,
} from "@/lib/landing/content";
import {
  getAirbnbCleaningTypes,
  getGardenTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getNannyTypes,
  getResidentialCleaningTypes,
} from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

export const CLEANING_PILLS_ID = HERO_CATEGORY_PANEL_IDS.cleaning;
export const NANNY_PILLS_ID = HERO_CATEGORY_PANEL_IDS.nanny;
export const HOUSEKEEPING_PILLS_ID = HERO_CATEGORY_PANEL_IDS.housekeeping;
export const SHORT_STAY_PILLS_ID = HERO_CATEGORY_PANEL_IDS.short_stay;
/** @deprecated Use SHORT_STAY_PILLS_ID */
export const AIRBNB_PILLS_ID = SHORT_STAY_PILLS_ID;
export const LAUNDRY_PILLS_ID = HERO_CATEGORY_PANEL_IDS.laundry;
export const GARDEN_PILLS_ID = HERO_CATEGORY_PANEL_IDS.garden;

const PANEL_ID_TO_CATEGORY: Record<string, HeroCategoryId> = {
  [HERO_CATEGORY_PANEL_IDS.nanny]: "nanny",
  [HERO_CATEGORY_PANEL_IDS.cleaning]: "cleaning",
  [HERO_CATEGORY_PANEL_IDS.housekeeping]: "housekeeping",
  [HERO_CATEGORY_PANEL_IDS.laundry]: "laundry",
  [HERO_CATEGORY_PANEL_IDS.garden]: "garden",
  [HERO_CATEGORY_PANEL_IDS.short_stay]: "short_stay",
  [LEGACY_SHORT_STAY_PANEL_ID]: "short_stay",
};

export function CategoryScroller() {
  const cleaningTypes = getResidentialCleaningTypes();
  const nannyTypes = getNannyTypes();
  const shortStayTypes = getAirbnbCleaningTypes();
  const housekeepingTypes = getHousekeepingTypes();
  const laundryTypes = getLaundryTypes();
  const gardenTypes = getGardenTypes();
  const [expanded, setExpanded] = useState<HeroCategoryId | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const category = PANEL_ID_TO_CATEGORY[hash];
    if (category) setExpanded(category);
  }, []);

  function toggleCategory(category: HeroCategoryId) {
    setExpanded((current) => (current === category ? null : category));
  }

  return (
    <div>
      <p className="text-sm font-semibold text-center text-muted-foreground mb-6">
        Choose the service you need
      </p>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
        {HERO_CATEGORIES.map((cat) => {
          const isOpen = expanded === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              aria-expanded={isOpen}
              aria-controls={cat.panelId}
              className={cn(
                "snap-start shrink-0 flex flex-col items-center gap-2 min-w-[6.5rem] max-w-[7rem] group rounded-2xl p-2 -m-1 transition-colors",
                isOpen && "bg-primary/10"
              )}
            >
              <div
                className={cn(
                  "transition-transform",
                  isOpen ? "scale-105" : "group-hover:scale-105"
                )}
              >
                <ServiceIcon name={cat.icon} className="h-16 w-16" />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold transition-colors text-center leading-snug",
                  isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                )}
              >
                {cat.label}
              </span>
              <span className="text-[10px] text-muted-foreground text-center leading-snug px-1">
                {cat.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {expanded === "cleaning" && (
        <div id={CLEANING_PILLS_ID} className="mt-8 scroll-mt-28 w-full">
          <CleaningTypeTabs
            value={cleaningTypes[0]?.id ?? "standard"}
            getHref={(typeId) => `/customer/book?category=cleaning&type=${typeId}`}
            showDetails={false}
            showSelection={false}
            edgeToEdge
            centered
          />
        </div>
      )}

      {expanded === "nanny" && (
        <div id={NANNY_PILLS_ID} className="mt-8 scroll-mt-28 w-full">
          <NannyTypeTabs
            value={nannyTypes[0]?.id ?? "day_nanny"}
            getHref={(typeId) => `/customer/book?category=nanny&type=${typeId}`}
            showDetails={false}
            showSelection={false}
            edgeToEdge
            centered
          />
        </div>
      )}

      {expanded === "housekeeping" && (
        <div id={HOUSEKEEPING_PILLS_ID} className="mt-8 scroll-mt-28 w-full">
          <HousekeepingTypeTabs
            value={housekeepingTypes[0]?.id ?? "half_day"}
            getHref={(typeId) => `/customer/book?category=housekeeping&type=${typeId}`}
            showDetails={false}
            showSelection={false}
            edgeToEdge
            centered
          />
        </div>
      )}

      {expanded === "laundry" && (
        <div id={LAUNDRY_PILLS_ID} className="mt-8 scroll-mt-28 w-full">
          <LaundryTypeTabs
            value={laundryTypes[0]?.id ?? "wash_fold"}
            getHref={(typeId) => `/customer/book?category=laundry&type=${typeId}`}
            showDetails={false}
            showSelection={false}
            edgeToEdge
            centered
          />
        </div>
      )}

      {expanded === "garden" && (
        <div id={GARDEN_PILLS_ID} className="mt-8 scroll-mt-28 w-full">
          <GardenTypeTabs
            value={gardenTypes[0]?.id ?? "lawn_cutting"}
            getHref={(typeId) => `/customer/book?category=garden&type=${typeId}`}
            showDetails={false}
            showSelection={false}
            edgeToEdge
            centered
          />
        </div>
      )}

      {expanded === "short_stay" && (
        <div id={SHORT_STAY_PILLS_ID} className="mt-8 scroll-mt-28 w-full">
          <AirbnbTypeTabs
            value={shortStayTypes[0]?.id ?? "guest_checkout"}
            getHref={(typeId) => `/customer/book/airbnb?type=${typeId}`}
            showDetails={false}
            showSelection={false}
            edgeToEdge
            centered
          />
        </div>
      )}
    </div>
  );
}
