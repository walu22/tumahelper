"use client";

import { ServiceCategoryExplorer } from "@/components/booking/service-category-explorer";
import { defaultServiceDetails } from "@/lib/services/catalog";
import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { buildBookUrl } from "@/lib/services/utils";

interface ServiceTypePickerProps {
  onSelect?: (categoryKey: ServiceCategoryKey, serviceTypeId: string) => void;
}

function bookHref(category: ServiceCategoryKey, typeId: string): string {
  return buildBookUrl({
    ...defaultServiceDetails(category),
    serviceType: typeId,
  });
}

export function ServiceTypePicker({ onSelect }: ServiceTypePickerProps) {
  return (
    <ServiceCategoryExplorer
      variant="page"
      showPopular
      onSelect={onSelect}
      getBookHref={bookHref}
      getAirbnbHref={(typeId) => `/customer/book/airbnb?type=${typeId}`}
    />
  );
}
