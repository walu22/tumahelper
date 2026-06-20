"use client";

import type { ComponentProps } from "react";
import { getHandymanTypes } from "@/lib/services/catalog";
import { ServiceTypePills } from "@/components/booking/service-type-pills";

type HandymanTypeTabsProps = Omit<
  ComponentProps<typeof ServiceTypePills>,
  "category" | "types" | "tablistLabel"
>;

export function HandymanTypeTabs(props: HandymanTypeTabsProps) {
  return (
    <ServiceTypePills
      category="handyman"
      types={getHandymanTypes()}
      tablistLabel="Type of handyman visit"
      {...props}
    />
  );
}
