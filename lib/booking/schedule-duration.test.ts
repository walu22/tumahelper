import { describe, expect, it } from "vitest";
import { defaultServiceDetails } from "@/lib/services/catalog";
import {
  ensureScheduleFits,
  getEffectiveBookingDuration,
  syncDetailsWithSchedule,
} from "./schedule-duration";
import { isScheduleBookable } from "./time-slots";

describe("syncDetailsWithSchedule", () => {
  it("clamps a late start when add-ons push spring cleaning to 8 hours", () => {
    const next = {
      ...defaultServiceDetails("cleaning"),
      serviceType: "spring",
      bedrooms: 3,
      bathrooms: 2,
      addons: ["laundry", "ironing"],
    };

    const { details, serviceTime } = syncDetailsWithSchedule(
      next,
      "16:30",
      "2026-12-20"
    );

    expect(details.durationHours).toBe(8);
    expect(serviceTime).not.toBe("16:30");
    expect(serviceTime).toBe("09:00");
  });
});

describe("ensureScheduleFits", () => {
  it("bumps duration and clears an impossible deep-clean start time", () => {
    const details = {
      ...defaultServiceDetails("cleaning"),
      serviceType: "deep",
      durationHours: 4,
      bedrooms: 5,
      bathrooms: 3,
      addons: ["ironing", "laundry", "oven", "fridge"],
    };

    expect(getEffectiveBookingDuration(details)).toBe(8);

    const { details: synced, serviceTime } = ensureScheduleFits(
      details,
      "16:30",
      "2026-06-25"
    );

    expect(synced.durationHours).toBe(8);
    expect(serviceTime).toBe("");
    expect(
      isScheduleBookable({
        serviceDate: "2026-06-25",
        startTime: serviceTime,
        durationHours: synced.durationHours,
        category: "cleaning",
        serviceType: "deep",
      })
    ).toBe(false);
  });
});
