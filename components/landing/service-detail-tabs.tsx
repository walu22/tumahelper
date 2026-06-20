"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { ServiceIcon } from "@/components/brand/service-icons";
import {
  HERO_CATEGORIES,
  SERVICE_DETAIL_TAB_ORDER,
  type HeroCategoryId,
} from "@/lib/landing/content";
import {
  SERVICE_CATALOG,
  defaultServiceDetails,
  getAirbnbCleaningTypes,
  getCookingTypes,
  getGardenTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getNannyTypes,
  getResidentialCleaningTypes,
  type ServiceCategoryKey,
  type ServiceTypeOption,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";
import { cn } from "@/lib/utils";

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

function getBookUrlForType(tabId: HeroCategoryId, type: ServiceTypeOption): string {
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

function getGuideHref(tabId: HeroCategoryId): string | null {
  if (tabId === "short_stay") return null;
  return `/services/${tabId}`;
}

function tabButtonLabel(tabId: HeroCategoryId): string {
  const meta = TAB_META[tabId];
  if (tabId === "short_stay") return "Short-stay";
  if (tabId === "cooking") return "Cooking";
  if (tabId === "housekeeping") return "Housekeeping";
  if (tabId === "laundry") return "Laundry";
  if (tabId === "garden") return "Garden";
  return meta.label;
}

function ServiceTypeDetail({
  tabId,
  type,
}: {
  tabId: HeroCategoryId;
  type: ServiceTypeOption;
}) {
  const bookHref = getBookUrlForType(tabId, type);
  const priceLine =
    type.pricingHint ??
    `Typical K${type.priceHintMin} – K${type.priceHintMax} · ~${type.defaultHours}h`;

  return (
    <details className="group rounded-2xl border border-border bg-card open:border-primary/30 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-4 md:p-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 text-left">
          <p className="font-semibold text-foreground">{type.label}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{priceLine}</p>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 mt-0.5" />
      </summary>

      <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-border/80">
        <p className="text-sm text-muted-foreground leading-relaxed pt-4">{type.description}</p>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            What&apos;s included
          </p>
          <ul className="space-y-1.5">
            {type.included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {type.notIncluded && type.notIncluded.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Not included
            </p>
            <ul className="space-y-1.5">
              {type.notIncluded.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href={bookHref}
          className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary hover:underline"
        >
          Book {type.tabLabel ?? type.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </details>
  );
}

export function ServiceDetailTabs() {
  const [activeTab, setActiveTab] = useState<HeroCategoryId>("cleaning");
  const meta = TAB_META[activeTab];
  const types = getTypesForTab(activeTab);
  const guideHref = getGuideHref(activeTab);
  const catalogEntry =
    activeTab === "short_stay" ? null : SERVICE_CATALOG[activeTab as ServiceCategoryKey];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Service categories"
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {SERVICE_DETAIL_TAB_ORDER.map((tabId) => {
          const tabMeta = TAB_META[tabId];
          const isActive = activeTab === tabId;

          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tabId)}
              className={cn(
                "snap-start shrink-0 flex flex-col items-center gap-1.5 min-w-[4.75rem] rounded-2xl border-2 px-3 py-2.5 transition-colors",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <ServiceIcon name={tabMeta.icon} className="h-10 w-10" />
              <span
                className={cn(
                  "text-[11px] font-semibold text-center leading-tight",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {tabButtonLabel(tabId)}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display text-2xl font-bold">{meta.label}</h3>
            <p className="text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              {catalogEntry?.tagline ?? meta.subtitle}
            </p>
          </div>
          <Link
            href={meta.href}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 shrink-0"
          >
            Choose on homepage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {types.map((type) => (
            <ServiceTypeDetail key={type.id} tabId={activeTab} type={type} />
          ))}
        </div>

        {catalogEntry && catalogEntry.addons.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm font-semibold mb-1">Optional add-ons</p>
            <p className="text-xs text-muted-foreground mb-3">
              Available for some visit types. Add during booking.
            </p>
            <div className="flex flex-wrap gap-2">
              {catalogEntry.addons.map((addon) => (
                <span
                  key={addon.id}
                  className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {addon.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {guideHref && (
          <Link
            href={guideHref}
            className="inline-flex items-center gap-1.5 mt-8 text-sm font-medium text-primary hover:underline"
          >
            Full service guide
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
