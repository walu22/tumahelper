"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ServiceIcon } from "@/components/brand/service-icons";
import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import { NannyTypeTabs } from "@/components/booking/nanny-type-tabs";
import { AirbnbTypeTabs } from "@/components/booking/airbnb-type-tabs";
import { CookingTypeTabs } from "@/components/booking/cooking-type-tabs";
import { HousekeepingTypeTabs } from "@/components/booking/housekeeping-type-tabs";
import { LaundryTypeTabs } from "@/components/booking/laundry-type-tabs";
import { GardenTypeTabs } from "@/components/booking/garden-type-tabs";
import { HandymanTypeTabs } from "@/components/booking/handyman-type-tabs";
import {
  HERO_CATEGORIES,
  HERO_CATEGORY_PANEL_IDS,
  type HeroCategoryId,
} from "@/lib/landing/content";
import {
  getAirbnbCleaningTypes,
  getCookingTypes,
  getGardenTypes,
  getHandymanTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getNannyTypes,
  getResidentialCleaningTypes,
  type ServiceCategoryKey,
} from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

const POPULAR_SERVICES: Array<{
  label: string;
  description: string;
  category: ServiceCategoryKey;
  typeId: string;
  icon: (typeof HERO_CATEGORIES)[number]["icon"];
}> = [
  {
    label: "House cleaning",
    description: "Bedrooms, kitchen, bathrooms",
    category: "cleaning",
    typeId: "standard",
    icon: "indoor",
  },
  {
    label: "Day nanny",
    description: "In-home childcare support",
    category: "nanny",
    typeId: "day_nanny",
    icon: "nanny",
  },
  {
    label: "Guest checkout clean",
    description: "Short-stay turnovers",
    category: "cleaning",
    typeId: "guest_checkout",
    icon: "short_stay",
  },
  {
    label: "Lunch prep",
    description: "Home-cooked midday meals",
    category: "cooking",
    typeId: "lunch",
    icon: "cooking",
  },
];

export type ServiceCategoryExplorerProps = {
  onSelect?: (category: ServiceCategoryKey, typeId: string) => void;
  getBookHref?: (category: ServiceCategoryKey, typeId: string) => string;
  getAirbnbHref?: (typeId: string) => string;
  /** Hero uses a horizontal icon scroller; booking page uses a card grid. */
  variant?: "hero" | "page";
  showPopular?: boolean;
  initialExpanded?: HeroCategoryId | null;
};

function linkOrSelect(
  category: ServiceCategoryKey,
  onSelect?: ServiceCategoryExplorerProps["onSelect"],
  getBookHref?: ServiceCategoryExplorerProps["getBookHref"]
) {
  return onSelect
    ? { onChange: (typeId: string) => onSelect(category, typeId) }
    : { getHref: (typeId: string) => getBookHref?.(category, typeId) ?? "#" };
}

export function ServiceCategoryExplorer({
  onSelect,
  getBookHref,
  getAirbnbHref,
  variant = "page",
  showPopular = variant === "page",
  initialExpanded = null,
}: ServiceCategoryExplorerProps) {
  const cleaningTypes = getResidentialCleaningTypes();
  const nannyTypes = getNannyTypes();
  const shortStayTypes = getAirbnbCleaningTypes();
  const housekeepingTypes = getHousekeepingTypes();
  const cookingTypes = getCookingTypes();
  const laundryTypes = getLaundryTypes();
  const gardenTypes = getGardenTypes();
  const handymanTypes = getHandymanTypes();
  const [expanded, setExpanded] = useState<HeroCategoryId | null>(initialExpanded);

  useEffect(() => {
    if (initialExpanded) setExpanded(initialExpanded);
  }, [initialExpanded]);

  const expandedCategory = HERO_CATEGORIES.find((category) => category.id === expanded);

  function toggleCategory(category: HeroCategoryId) {
    setExpanded((current) => (current === category ? null : category));
  }

  function handlePopularPick(category: ServiceCategoryKey, typeId: string) {
    if (onSelect) {
      onSelect(category, typeId);
      return;
    }
    const href = getBookHref?.(category, typeId);
    if (href) window.location.href = href;
  }

  const airbnbLinkProps = onSelect
    ? { onChange: (typeId: string) => onSelect("cleaning", typeId) }
    : { getHref: (typeId: string) => getAirbnbHref?.(typeId) ?? "#" };

  return (
    <div className="space-y-8">
      {variant === "page" ? (
        <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4 sm:px-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Tell us what you need and we&apos;ll guide you through address, schedule, and worker
            choice. Payment comes after you confirm your booking.
          </p>
        </div>
      ) : null}

      {showPopular ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Popular in Lusaka</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jump straight to a common booking type
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {POPULAR_SERVICES.map((service) => (
              <button
                key={`${service.category}-${service.typeId}`}
                type="button"
                onClick={() => handlePopularPick(service.category, service.typeId)}
                className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <div className="shrink-0 transition-transform group-hover:scale-105">
                  <ServiceIcon name={service.icon} className="h-12 w-12" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{service.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Browse all services</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {variant === "hero"
              ? "Tap a category, then choose the visit type"
              : "Pick a category to see available visit types"}
          </p>
        </div>

        {variant === "hero" ? (
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
            {HERO_CATEGORIES.map((category) => {
              const isOpen = expanded === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isOpen}
                  aria-controls={category.panelId}
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
                    <ServiceIcon name={category.icon} className="h-16 w-16" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold transition-colors text-center leading-snug",
                      isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}
                  >
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {HERO_CATEGORIES.map((category) => {
              const isOpen = expanded === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isOpen}
                  aria-controls={category.panelId}
                  className={cn(
                    "group flex h-full flex-col items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-all",
                    isOpen
                      ? "border-primary ring-2 ring-primary/15 shadow-sm"
                      : "border-border/70 hover:border-primary/40 hover:shadow-sm"
                  )}
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="transition-transform group-hover:scale-105">
                      <ServiceIcon name={category.icon} className="h-12 w-12" />
                    </div>
                    <ChevronRight
                      className={cn(
                        "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-90 text-primary"
                      )}
                    />
                  </div>
                  <div>
                    <p className={cn("font-semibold text-sm", isOpen && "text-primary")}>
                      {category.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {category.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {expandedCategory ? (
        <section
          id={expandedCategory.panelId}
          className="scroll-mt-28 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5"
        >
          <div className="mb-4 flex items-start gap-3">
            <ServiceIcon name={expandedCategory.icon} className="h-10 w-10 shrink-0" />
            <div>
              <h3 className="font-semibold">{expandedCategory.label}</h3>
              <p className="text-sm text-muted-foreground">{expandedCategory.subtitle}</p>
            </div>
          </div>

          {expanded === "cleaning" && (
            <CleaningTypeTabs
              value={cleaningTypes[0]?.id ?? "standard"}
              showDetails={false}
              showSelection={false}
              edgeToEdge
              centered
              {...linkOrSelect("cleaning", onSelect, getBookHref)}
            />
          )}

          {expanded === "nanny" && (
            <NannyTypeTabs
              value={nannyTypes[0]?.id ?? "day_nanny"}
              showDetails={false}
              showSelection={false}
              edgeToEdge
              centered
              {...linkOrSelect("nanny", onSelect, getBookHref)}
            />
          )}

          {expanded === "housekeeping" && (
            <HousekeepingTypeTabs
              value={housekeepingTypes[0]?.id ?? "half_day"}
              showDetails={false}
              showSelection={false}
              edgeToEdge
              centered
              {...linkOrSelect("housekeeping", onSelect, getBookHref)}
            />
          )}

          {expanded === "cooking" && (
            <CookingTypeTabs
              value={cookingTypes[0]?.id ?? "lunch"}
              showDetails={false}
              showSelection={false}
              edgeToEdge
              centered
              {...linkOrSelect("cooking", onSelect, getBookHref)}
            />
          )}

          {expanded === "laundry" && (
            <LaundryTypeTabs
              value={laundryTypes[0]?.id ?? "wash_fold"}
              showDetails={false}
              showSelection={false}
              edgeToEdge
              centered
              {...linkOrSelect("laundry", onSelect, getBookHref)}
            />
          )}

          {expanded === "garden" && (
            <GardenTypeTabs
              value={gardenTypes[0]?.id ?? "lawn_cutting"}
              showDetails={false}
              showSelection={false}
              edgeToEdge
              centered
              {...linkOrSelect("garden", onSelect, getBookHref)}
            />
          )}

          {expanded === "handyman" && (
            <HandymanTypeTabs
              value={handymanTypes[0]?.id ?? "general_handyman"}
              showDetails={false}
              showSelection={false}
              edgeToEdge
              centered
              {...linkOrSelect("handyman", onSelect, getBookHref)}
            />
          )}

          {expanded === "short_stay" && (
            <AirbnbTypeTabs
              value={shortStayTypes[0]?.id ?? "guest_checkout"}
              showDetails={false}
              showSelection={false}
              edgeToEdge
              centered
              {...airbnbLinkProps}
            />
          )}
        </section>
      ) : variant === "page" ? (
        <p className="text-center text-sm text-muted-foreground">
          Select a category above to see visit types
        </p>
      ) : null}
    </div>
  );
}

export {
  HERO_CATEGORY_PANEL_IDS as SERVICE_CATEGORY_PANEL_IDS,
};
