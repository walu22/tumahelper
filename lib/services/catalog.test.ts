import { describe, expect, it } from "vitest";
import {
  getAirbnbCleaningTypes,
  getAvailableAddons,
  getGardenTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getNannyTypes,
  getServiceType,
  getResidentialCleaningTypes,
  isAirbnbCleaningType,
  normalizeServiceType,
  sanitizeAddons,
} from "./catalog";

describe("service catalog add-ons", () => {
  it("offers no add-ons for move cleans — scope is fully included", () => {
    const moveAddons = getAvailableAddons("cleaning", "move");
    expect(moveAddons).toEqual([]);
  });

  it("excludes deep clean from inside cabinets add-on", () => {
    const deepAddons = getAvailableAddons("cleaning", "deep");
    expect(deepAddons.some((a) => a.id === "cabinets")).toBe(false);
    expect(deepAddons.some((a) => a.id === "oven")).toBe(true);
  });

  it("includes turnover-relevant add-ons for guest checkout clean", () => {
    const airbnbAddons = getAvailableAddons("cleaning", "guest_checkout");
    expect(airbnbAddons.map((a) => a.id)).toContain("laundry");
    expect(airbnbAddons.map((a) => a.id)).toContain("photo_report");
  });

  it("strips invalid add-ons when service type changes to move", () => {
    expect(sanitizeAddons("cleaning", "move", ["oven", "laundry", "ironing"])).toEqual([]);
  });

  it("defines not-included boundaries for every cleaning type", () => {
    for (const type of [
      "standard",
      "spring",
      "apartment",
      "deep",
      "garage",
      "move",
      "guest_checkout",
      "same_day_turnaround",
      "deep_airbnb",
      "linen_setup",
    ] as const) {
      const service = getServiceType("cleaning", type);
      expect(service?.notIncluded?.length).toBeGreaterThan(0);
    }
  });

  it("lists six residential cleaning tabs in market order excluding airbnb", () => {
    const types = getResidentialCleaningTypes();
    expect(types).toHaveLength(6);
    expect(types.map((t) => t.id)).toEqual([
      "standard",
      "apartment",
      "deep",
      "spring",
      "move",
      "garage",
    ]);
    expect(types[0]?.label).toBe("House cleaning");
  });

  it("lists four airbnb cleaning tabs for launch", () => {
    const types = getAirbnbCleaningTypes();
    expect(types).toHaveLength(4);
    expect(types.map((t) => t.id)).toEqual([
      "guest_checkout",
      "same_day_turnaround",
      "deep_airbnb",
      "linen_setup",
    ]);
  });

  it("lists five nanny tabs for launch", () => {
    const types = getNannyTypes();
    expect(types).toHaveLength(5);
  });

  it("lists four housekeeping tabs for launch", () => {
    const types = getHousekeepingTypes();
    expect(types).toHaveLength(4);
    expect(types.map((t) => t.id)).toEqual([
      "half_day",
      "full_day",
      "weekly",
      "monthly",
    ]);
    expect(types[0]?.defaultHours).toBe(4);
    expect(types[1]?.defaultHours).toBe(8);
  });

  it("offers duty add-ons for housekeeping visits", () => {
    const duties = getAvailableAddons("housekeeping", "half_day");
    expect(duties.map((d) => d.id)).toEqual([
      "cleaning",
      "dishes",
      "laundry",
      "ironing",
      "bedding",
      "meal_prep",
      "tidying",
      "outside_sweep",
    ]);
  });

  it("lists five laundry tabs for launch", () => {
    const types = getLaundryTypes();
    expect(types).toHaveLength(5);
    expect(types.map((t) => t.id)).toEqual([
      "wash_fold",
      "ironing",
      "bedding_laundry",
      "curtain_laundry",
      "pickup_dropoff",
    ]);
  });

  it("lists five garden tabs for launch", () => {
    const types = getGardenTypes();
    expect(types).toHaveLength(5);
    expect(types.map((t) => t.id)).toEqual([
      "lawn_cutting",
      "yard_sweeping",
      "hedge_trimming",
      "garden_cleanup",
      "watering_plants",
    ]);
  });

  it("normalizes legacy service type ids", () => {
    expect(normalizeServiceType("nanny", "babysitting")).toBe("babysitter");
    expect(normalizeServiceType("cleaning", "airbnb")).toBe("guest_checkout");
    expect(isAirbnbCleaningType("guest_checkout")).toBe(true);
    expect(isAirbnbCleaningType("airbnb")).toBe(true);
  });
});
