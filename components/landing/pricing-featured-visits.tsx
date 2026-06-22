"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/brand/service-icons";
import {
  GET_HELP_HREF,
  PRICING_COMPARE_TYPES_LABEL,
  PRICING_PRIMARY_TAB_ORDER,
  PRICING_SECONDARY_TAB_ORDER,
  PRICING_SECTION_ID,
  SERVICES_DETAIL_INTRO,
  type HeroCategoryId,
} from "@/lib/landing/content";
import {
  getPricingCategory,
  getPricingFeaturedCategories,
  type PricingFeaturedCategory,
} from "@/lib/landing/pricing-featured";
import { cn } from "@/lib/utils";

const CATEGORIES = getPricingFeaturedCategories();
const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((category) => [category.id, category])) as Record<
  HeroCategoryId,
  PricingFeaturedCategory
>;

function parsePricingHash(hash: string): HeroCategoryId | null {
  const normalized = hash.replace("#", "");
  if (!normalized.startsWith("pricing-")) return null;
  const tabId = normalized.replace("pricing-", "") as HeroCategoryId;
  return tabId in CATEGORY_BY_ID ? tabId : null;
}

function FeaturedPriceCard({ category }: { category: PricingFeaturedCategory }) {
  const { featured } = category;

  return (
    <div className="rounded-3xl border border-border bg-card p-8 md:p-10 max-w-lg mx-auto text-center">
      <p className="font-semibold text-lg text-foreground">{featured.label}</p>
      <p className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 tracking-tight">
        {featured.priceLabel}
      </p>
      <p className="text-sm text-muted-foreground mt-2">{featured.hoursLabel}</p>
      <Link
        href={featured.bookHref}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95 mt-8"
      >
        {featured.bookLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function PricingFeaturedVisits() {
  const [activeTab, setActiveTab] = useState<HeroCategoryId>("cleaning");
  const activeCategory = getPricingCategory(activeTab);

  useEffect(() => {
    const applyHash = () => {
      const tabId = parsePricingHash(window.location.hash);
      if (tabId) {
        setActiveTab(tabId);
        document.getElementById(PRICING_SECTION_ID)?.scrollIntoView({ behavior: "smooth" });
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  function selectTab(tabId: HeroCategoryId) {
    setActiveTab(tabId);
    const nextHash = `pricing-${tabId}`;
    if (window.location.hash.replace("#", "") !== nextHash) {
      window.history.replaceState(null, "", `/#${nextHash}`);
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Popular service prices"
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 justify-start md:justify-center"
      >
        {PRICING_PRIMARY_TAB_ORDER.map((tabId) => {
          const category = CATEGORY_BY_ID[tabId];
          const isActive = activeTab === tabId;

          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectTab(tabId)}
              className={cn(
                "snap-start shrink-0 flex flex-col items-center gap-1.5 min-w-[4.75rem] rounded-2xl border-2 px-3 py-2.5 transition-colors",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <ServiceIcon name={category.icon} className="h-10 w-10" />
              <span
                className={cn(
                  "text-[11px] font-semibold text-center leading-tight",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {category.tabLabel}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-8 text-sm">
        {PRICING_SECONDARY_TAB_ORDER.map((tabId) => {
          const category = CATEGORY_BY_ID[tabId];
          const isActive = activeTab === tabId;

          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectTab(tabId)}
              className={cn(
                "font-medium transition-colors",
                isActive ? "text-primary underline underline-offset-4" : "text-muted-foreground hover:text-primary"
              )}
            >
              {category.tabLabel}
            </button>
          );
        })}
      </div>

      <div role="tabpanel">
        <FeaturedPriceCard category={activeCategory} />
      </div>

      <p className="text-center mt-6">
        <Link
          href={GET_HELP_HREF}
          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          {PRICING_COMPARE_TYPES_LABEL}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>

      <p className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
        {SERVICES_DETAIL_INTRO.footnote}
      </p>
    </div>
  );
}
