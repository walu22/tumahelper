"use client";

import Link from "next/link";
import { HERO_CATEGORIES } from "@/lib/landing/content";
import { ServiceIcon } from "@/components/brand/service-icons";
import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import { getResidentialCleaningTypes } from "@/lib/services/catalog";

export function CategoryScroller() {
  const cleaningTypes = getResidentialCleaningTypes();

  return (
    <div>
      <p className="text-sm font-semibold text-center text-muted-foreground mb-6">
        Choose the service you need
      </p>
      <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
        {HERO_CATEGORIES.map((cat) => {
          const isCleaning = cat.icon === "indoor";

          if (isCleaning) {
            return (
              <div
                key={cat.label}
                className="snap-start shrink-0 flex flex-col items-center gap-2 min-w-[5.5rem] rounded-2xl p-1 -m-1 bg-primary/10"
              >
                <div className="scale-105">
                  <ServiceIcon name={cat.icon} className="h-16 w-16" />
                </div>
                <span className="text-xs font-semibold text-primary text-center max-w-[5.5rem]">
                  {cat.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={cat.label}
              href={cat.href}
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

      <div id="hero-cleaning-panel" className="mt-8 max-w-2xl mx-auto px-2">
        <CleaningTypeTabs
          value={cleaningTypes[0]?.id ?? "standard"}
          getHref={(typeId) => `/customer/book?category=cleaning&type=${typeId}`}
          showDetails={false}
          centered
        />
      </div>
    </div>
  );
}
