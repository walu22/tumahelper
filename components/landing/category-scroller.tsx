"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HERO_CATEGORIES } from "@/lib/landing/content";
import { ServiceIcon } from "@/components/brand/service-icons";
import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import { NannyTypeTabs } from "@/components/booking/nanny-type-tabs";
import { AirbnbTypeTabs } from "@/components/booking/airbnb-type-tabs";
import {
  getAirbnbCleaningTypes,
  getNannyTypes,
  getResidentialCleaningTypes,
} from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

export const CLEANING_PILLS_ID = "hero-cleaning-panel";
export const NANNY_PILLS_ID = "hero-nanny-panel";
export const AIRBNB_PILLS_ID = "hero-airbnb-panel";

type ExpandedCategory = "cleaning" | "nanny" | "airbnb" | null;

export function CategoryScroller() {
  const cleaningTypes = getResidentialCleaningTypes();
  const nannyTypes = getNannyTypes();
  const airbnbTypes = getAirbnbCleaningTypes();
  const [expanded, setExpanded] = useState<ExpandedCategory>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === CLEANING_PILLS_ID) setExpanded("cleaning");
    if (hash === NANNY_PILLS_ID) setExpanded("nanny");
    if (hash === AIRBNB_PILLS_ID) setExpanded("airbnb");
  }, []);

  function toggleCategory(category: ExpandedCategory) {
    setExpanded((current) => (current === category ? null : category));
  }

  return (
    <div>
      <p className="text-sm font-semibold text-center text-muted-foreground mb-6">
        Choose the service you need
      </p>
      <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
        {HERO_CATEGORIES.map((cat) => {
          const isCleaning = cat.icon === "indoor";
          const isNanny = cat.icon === "nanny";
          const isAirbnb = cat.icon === "airbnb";
          const isExpandable = isCleaning || isNanny || isAirbnb;
          const panelId = isCleaning
            ? CLEANING_PILLS_ID
            : isNanny
              ? NANNY_PILLS_ID
              : AIRBNB_PILLS_ID;
          const isOpen =
            (isCleaning && expanded === "cleaning") ||
            (isNanny && expanded === "nanny") ||
            (isAirbnb && expanded === "airbnb");

          if (isExpandable) {
            const categoryKey: ExpandedCategory = isCleaning
              ? "cleaning"
              : isNanny
                ? "nanny"
                : "airbnb";

            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => toggleCategory(categoryKey)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={cn(
                  "snap-start shrink-0 flex flex-col items-center gap-2 min-w-[5.5rem] group rounded-2xl p-1 -m-1 transition-colors",
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
                    "text-xs font-semibold transition-colors text-center max-w-[5.5rem]",
                    isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}
                >
                  {cat.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={() => setExpanded(null)}
              className="snap-start shrink-0 flex flex-col items-center gap-2 min-w-[5.5rem] group"
            >
              <div className="transition-transform group-hover:scale-105">
                <ServiceIcon name={cat.icon} className="h-16 w-16" />
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors text-center max-w-[5.5rem]">
                {cat.label}
              </span>
            </Link>
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

      {expanded === "airbnb" && (
        <div id={AIRBNB_PILLS_ID} className="mt-8 scroll-mt-28 w-full">
          <AirbnbTypeTabs
            value={airbnbTypes[0]?.id ?? "guest_checkout"}
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
