"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CleaningTypeTabs } from "@/components/booking/cleaning-type-tabs";
import {
  catalogServiceTypeOptions,
  defaultServiceDetails,
  getResidentialCleaningTypes,
  type ServiceCategoryKey,
} from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

interface ServiceTypePickerProps {
  onSelect?: (categoryKey: ServiceCategoryKey, serviceTypeId: string) => void;
}

export function ServiceTypePicker(_props: ServiceTypePickerProps) {
  const options = catalogServiceTypeOptions();
  const nannyOptions = options.filter((o) => o.categoryKey === "nanny");
  const cleaningTypes = getResidentialCleaningTypes();

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
        <CleaningTypeTabs
          value={cleaningTypes[0]?.id ?? "standard"}
          getHref={(typeId) =>
            buildBookUrl({
              ...defaultServiceDetails("cleaning"),
              serviceType: typeId,
            })
          }
          showDetails={false}
        />
      </section>

      {nannyOptions.length > 0 && (
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Nannies & childcare
          </p>
          <ul className="space-y-3">
            {nannyOptions.map(({ categoryKey, type }) => (
              <li key={type.id}>
                <Link
                  href={buildBookUrl({
                    ...defaultServiceDetails(categoryKey),
                    serviceType: type.id,
                  })}
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
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
