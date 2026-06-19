"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { getServiceType, SERVICE_CATALOG, type ServiceCategoryKey } from "@/lib/services/catalog";
import { SlideOverPanel } from "@/components/booking/slide-over-panel";

interface ServiceScopeTeaserProps {
  category: ServiceCategoryKey;
  serviceType: string;
  embedded?: boolean;
}

export function ServiceScopeTeaser({
  category,
  serviceType,
  embedded = false,
}: ServiceScopeTeaserProps) {
  const [open, setOpen] = useState(false);
  const entry = SERVICE_CATALOG[category];
  const type = getServiceType(category, serviceType);
  if (!type) return null;

  const wrapperClass = embedded
    ? "border-t border-border pt-4"
    : "rounded-2xl border border-border bg-surface/40 p-5 sm:p-6";

  const includedHeading =
    category === "nanny" ? "What's included in this visit" : "What's included in this clean";

  const pricingLine =
    type.pricingHint ??
    `Typical K${type.priceHintMin} – K${type.priceHintMax} · ~${type.defaultHours}h`;

  return (
    <>
      <div className={wrapperClass}>
        <p className="font-semibold text-foreground text-base">{type.label}</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{type.description}</p>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          <span className="font-semibold text-foreground">Pricing hint: </span>
          {pricingLine}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 text-sm font-semibold text-primary hover:underline underline-offset-2"
        >
          View full checklist
        </button>
      </div>

      <SlideOverPanel open={open} onClose={() => setOpen(false)} title={type.label}>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">{entry.title}</p>
          <div>
            <p className="text-sm font-semibold mb-3">{includedHeading}</p>
            <ul className="space-y-2">
              {type.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {type.notIncluded && type.notIncluded.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-3">Not included</p>
              <ul className="space-y-2">
                {type.notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X className="h-4 w-4 text-muted-foreground/70 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SlideOverPanel>
    </>
  );
}
