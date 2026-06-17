import { describe, expect, it } from "vitest";
import {
  getAvailableAddons,
  getServiceType,
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

  it("includes turnover-relevant add-ons for between-guest clean", () => {
    const airbnbAddons = getAvailableAddons("cleaning", "airbnb");
    expect(airbnbAddons.map((a) => a.id)).toContain("laundry");
    expect(airbnbAddons.map((a) => a.id)).toContain("cabinets");
  });

  it("strips invalid add-ons when service type changes to move", () => {
    expect(sanitizeAddons("cleaning", "move", ["oven", "laundry", "ironing"])).toEqual([]);
  });

  it("defines not-included boundaries for every cleaning type", () => {
    for (const type of ["standard", "deep", "move", "airbnb"] as const) {
      const service = getServiceType("cleaning", type);
      expect(service?.notIncluded?.length).toBeGreaterThan(0);
    }
  });
});
