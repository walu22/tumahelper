"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ServiceIcon } from "@/components/brand/service-icons";
import { SERVICES_DETAIL_INTRO } from "@/lib/landing/content";
import {
  getPricingFeaturedCategories,
  type PricingFeaturedCategory,
} from "@/lib/landing/pricing-featured";
import type { HeroCategoryId } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

const CATEGORIES = getPricingFeaturedCategories();

function FeaturedVisitCard({ category }: { category: PricingFeaturedCategory }) {
  const { featured } = category;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">{category.categoryLabel}</h3>
          <p className="text-muted-foreground mt-2 leading-relaxed max-w-2xl">{category.tagline}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/60 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <p className="font-semibold text-lg text-foreground">{featured.label}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {featured.hoursLabel} · {featured.priceLabel}
            </p>
          </div>
          <Link
            href={featured.bookHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 shrink-0"
          >
            {featured.bookLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{featured.description}</p>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            What&apos;s included
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {featured.included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {category.guideHref && (
          <Link
            href={category.guideHref}
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-primary hover:underline"
          >
            {category.allTypesLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function PricingFeaturedVisits() {
  const [activeTab, setActiveTab] = useState<HeroCategoryId>("cleaning");
  const activeCategory = CATEGORIES.find((category) => category.id === activeTab) ?? CATEGORIES[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Service categories"
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8"
      >
        {CATEGORIES.map((category) => {
          const isActive = activeTab === category.id;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(category.id)}
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

      <div role="tabpanel">
        <FeaturedVisitCard category={activeCategory} />
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed">
        {SERVICES_DETAIL_INTRO.footnote}
      </p>
    </div>
  );
}
