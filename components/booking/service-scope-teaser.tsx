"use client";

import { ServiceDetailsCard } from "@/components/booking/service-details-card";
import type { ServiceCategoryKey } from "@/lib/services/catalog";

/** @deprecated Use ServiceDetailsCard with variant="selection" */
export function ServiceScopeTeaser({
  category,
  serviceType,
  embedded = false,
}: {
  category: ServiceCategoryKey;
  serviceType: string;
  embedded?: boolean;
}) {
  return (
    <ServiceDetailsCard
      category={category}
      serviceType={serviceType}
      variant="selection"
      className={
        embedded ? "border-0 bg-transparent p-0 rounded-none shadow-none" : undefined
      }
    />
  );
}
