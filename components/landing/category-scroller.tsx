"use client";

import { useState } from "react";
import Link from "next/link";
import { AIRBNB_CLEAN_BOOK_HREF } from "@/lib/landing/content";
import {
  SERVICE_CATALOG,
  defaultServiceDetails,
  getResidentialCleaningTypes,
  type ServiceCategoryKey,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";
import { ServiceProjectCard } from "@/components/landing/service-project-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroTabId = "nanny" | "cleaning" | "airbnb";

const HERO_TAB_ORDER: HeroTabId[] = ["nanny", "cleaning", "airbnb"];

const TAB_META: Record<
  HeroTabId,
  { label: string; categoryKey?: ServiceCategoryKey }
> = {
  nanny: { label: "Nannies", categoryKey: "nanny" },
  cleaning: { label: "Cleaning", categoryKey: "cleaning" },
  airbnb: { label: "Airbnb clean" },
};

function bookHrefForType(category: ServiceCategoryKey, typeId: string): string {
  return buildBookUrl({
    ...defaultServiceDetails(category),
    serviceType: typeId,
    durationHours:
      SERVICE_CATALOG[category].types.find((t) => t.id === typeId)?.defaultHours ??
      defaultServiceDetails(category).durationHours,
  });
}

export function CategoryScroller() {
  const [activeTab, setActiveTab] = useState<HeroTabId>("cleaning");

  const cleaningTypes = getResidentialCleaningTypes();
  const nannyTypes = SERVICE_CATALOG.nanny.types;
  const airbnbType = SERVICE_CATALOG.cleaning.types.find((t) => t.id === "airbnb");

  const activeEntry =
    activeTab === "nanny"
      ? SERVICE_CATALOG.nanny
      : activeTab === "cleaning"
        ? SERVICE_CATALOG.cleaning
        : null;

  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-sm font-semibold text-center text-muted-foreground mb-5">
        Choose the service you need
      </p>

      <div
        role="tablist"
        aria-label="Service categories"
        className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-border -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {HERO_TAB_ORDER.map((tabId) => {
          const { label } = TAB_META[tabId];
          const isActive = activeTab === tabId;

          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`hero-panel-${tabId}`}
              id={`hero-tab-${tabId}`}
              onClick={() => setActiveTab(tabId)}
              className={cn(
                "shrink-0 px-4 sm:px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px min-h-11",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === "airbnb" && airbnbType && (
        <div
          id="hero-panel-airbnb"
          role="tabpanel"
          aria-labelledby="hero-tab-airbnb"
          className="mt-8 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Airbnb &amp; short-stay cleaning
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">
              Between-guest cleans for Airbnb and short-stay properties — beds remade, kitchen
              reset, and ready before the next guest arrives.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <ServiceProjectCard type={airbnbType} href={AIRBNB_CLEAN_BOOK_HREF} />
          </div>

          <div className="text-center mt-6">
            <Button asChild className="rounded-full min-h-11 px-8">
              <Link href={AIRBNB_CLEAN_BOOK_HREF}>Book Airbnb clean</Link>
            </Button>
          </div>
        </div>
      )}

      {activeEntry && activeTab !== "airbnb" && (
        <div
          id={`hero-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`hero-tab-${activeTab}`}
          className="mt-8 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              {activeEntry.title}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto leading-relaxed">
              {activeEntry.tagline}
            </p>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 text-center sm:text-left">
            Popular {activeTab === "cleaning" ? "cleans" : "visits"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(activeTab === "cleaning" ? cleaningTypes : nannyTypes).map((type) => (
              <ServiceProjectCard
                key={type.id}
                type={type}
                href={bookHrefForType(activeEntry.key, type.id)}
              />
            ))}
          </div>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Or{" "}
            <Link
              href={
                activeTab === "cleaning"
                  ? "/customer/book?category=cleaning"
                  : "/customer/book?category=nanny"
              }
              className="font-semibold text-primary hover:underline"
            >
              browse all {activeTab === "cleaning" ? "cleaning" : "nanny"} options
            </Link>
          </p>
        </div>
      )}

    </div>
  );
}
