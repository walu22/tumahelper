"use client";

import type { ComponentProps } from "react";
import { getHousekeepingTypes } from "@/lib/services/catalog";
import { ServiceTypePills } from "@/components/booking/service-type-pills";

type HousekeepingTypeTabsProps = Omit<
  ComponentProps<typeof ServiceTypePills>,
  "category" | "types" | "tablistLabel"
>;

export function HousekeepingTypeTabs(props: HousekeepingTypeTabsProps) {
  return (
    <ServiceTypePills
      category="housekeeping"
      types={getHousekeepingTypes()}
      tablistLabel="Type of housekeeping visit"
      {...props}
    />
  );
}
