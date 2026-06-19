"use client";

import type { ComponentProps } from "react";
import { getGardenTypes } from "@/lib/services/catalog";
import { ServiceTypePills } from "@/components/booking/service-type-pills";

type GardenTypeTabsProps = Omit<
  ComponentProps<typeof ServiceTypePills>,
  "category" | "types" | "tablistLabel"
>;

export function GardenTypeTabs(props: GardenTypeTabsProps) {
  return (
    <ServiceTypePills
      category="garden"
      types={getGardenTypes()}
      tablistLabel="Type of garden help"
      {...props}
    />
  );
}
