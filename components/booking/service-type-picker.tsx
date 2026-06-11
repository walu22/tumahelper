"use client";

import { ChevronRight } from "lucide-react";
import { catalogServiceTypeOptions, type ServiceCategoryKey } from "@/lib/services/catalog";

interface ServiceTypePickerProps {
  onSelect: (categoryKey: ServiceCategoryKey, serviceTypeId: string) => void;
}

export function ServiceTypePicker({ onSelect }: ServiceTypePickerProps) {
  const options = catalogServiceTypeOptions();
  let lastCategory: ServiceCategoryKey | null = null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Pick the service that best matches your visit. You&apos;ll set date, time, and
        address on the next screen.
      </p>

      <ul className="space-y-3">
        {options.map(({ categoryKey, categoryTitle, type }) => {
          const showHeading = categoryKey !== lastCategory;
          lastCategory = categoryKey;

          return (
            <li key={`${categoryKey}-${type.id}`}>
              {showHeading && (
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 mt-2 first:mt-0">
                  {categoryTitle}
                </p>
              )}
              <button
                type="button"
                onClick={() => onSelect(categoryKey, type.id)}
                className="w-full rounded-xl border border-border p-4 text-left flex items-start gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {type.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Typical K{type.priceHintMin} – K{type.priceHintMax} · ~{type.defaultHours}h
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
