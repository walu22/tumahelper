"use client";

import type { ComponentProps } from "react";
import { getLaundryTypes } from "@/lib/services/catalog";
import { ServiceTypePills } from "@/components/booking/service-type-pills";

type LaundryTypeTabsProps = Omit<
  ComponentProps<typeof ServiceTypePills>,
  "category" | "types" | "tablistLabel"
>;

export function LaundryTypeTabs(props: LaundryTypeTabsProps) {
  return (
    <ServiceTypePills
      category="laundry"
      types={getLaundryTypes()}
      tablistLabel="Type of laundry help"
      {...props}
    />
  );
}
