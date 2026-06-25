import { describe, expect, it } from "vitest";
import { defaultServiceDetails } from "@/lib/services/catalog";
import { syncDetailsWithSchedule } from "./schedule-duration";

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
