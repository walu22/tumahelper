"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import {
  catalogServiceTypeOptions,
  getResidentialCleaningTypes,
  type ServiceCategoryKey,
} from "@/lib/services/catalog";

interface ServiceTypePickerProps {
  onSelect: (categoryKey: ServiceCategoryKey, serviceTypeId: string) => void;
}

export function ServiceTypePicker({ onSelect }: ServiceTypePickerProps) {
  const options = catalogServiceTypeOptions();
  const nannyOptions = options.filter((o) => o.categoryKey === "nanny");
  const cleaningTypes = getResidentialCleaningTypes();
  const [cleaningType, setCleaningType] = useState(cleaningTypes[0]?.id ?? "standard");

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Pick the service that best matches your visit. You&apos;ll set your address and schedule
        next.
      </p>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          House cleaning
        </p>
        <CleaningTypeTabs value={cleaningType} onChange={setCleaningType} />
        <Button
          type="button"
          className="w-full mt-4 min-h-11"
          onClick={() => onSelect("cleaning", cleaningType)}
        >
          Book this clean
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {nannyOptions.length > 0 && (
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Nannies & childcare
          </p>
          <ul className="space-y-3">
            {nannyOptions.map(({ categoryKey, type }) => (
              <li key={type.id}>
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
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
