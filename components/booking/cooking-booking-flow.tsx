"use client";

import {
  HousekeepingBookingFlow,
  type HousekeepingBookingFlowProps,
} from "@/components/booking/housekeeping-booking-flow";

export function CookingBookingFlow(
  props: Omit<HousekeepingBookingFlowProps, "variant">
) {
  return <HousekeepingBookingFlow {...props} variant="cooking" />;
}
