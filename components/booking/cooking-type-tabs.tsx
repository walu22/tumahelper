"use client";

import type { ComponentProps } from "react";
import { getCookingTypes } from "@/lib/services/catalog";
import { ServiceTypePills } from "@/components/booking/service-type-pills";

type CookingTypeTabsProps = Omit<
  ComponentProps<typeof ServiceTypePills>,
  "category" | "types" | "tablistLabel"
>;

export function CookingTypeTabs(props: CookingTypeTabsProps) {
  return (
    <ServiceTypePills
      category="cooking"
      types={getCookingTypes()}
      tablistLabel="Type of cooking visit"
      {...props}
    />
  );
}
