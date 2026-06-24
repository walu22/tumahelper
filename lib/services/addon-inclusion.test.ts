import { describe, expect, it } from "vitest";
import { getAvailableAddons, getServiceType } from "./catalog";

describe("addon inclusion scope", () => {
  it("hides interior windows add-on when spring cleaning already includes them", () => {
    const ids = getAvailableAddons("cleaning", "spring").map((a) => a.id);
    expect(ids).not.toContain("windows");
    expect(getServiceType("cleaning", "spring")?.included).toContain("Interior windows");
  });

  it("hides kitchen cleanup add-on when lunch cooking includes it", () => {
    const ids = getAvailableAddons("cooking", "lunch").map((a) => a.id);
    expect(ids).not.toContain("kitchen_cleanup");
  });

  it("hides nanny meal prep and bottle washing add-ons for day nanny", () => {
    const ids = getAvailableAddons("nanny", "day_nanny").map((a) => a.id);
    expect(ids).not.toContain("meal_prep");
    expect(ids).not.toContain("bottle_washing");
  });

  it("hides homework add-on for after-school care", () => {
    const ids = getAvailableAddons("nanny", "after_school").map((a) => a.id);
    expect(ids).not.toContain("homework");
  });

  it("hides tidying duty add-on for half-day housekeeping", () => {
    const ids = getAvailableAddons("housekeeping", "half_day").map((a) => a.id);
    expect(ids).not.toContain("tidying");
  });

  it("hides laundry and bedding add-ons for monthly housekeeping", () => {
    const ids = getAvailableAddons("housekeeping", "monthly").map((a) => a.id);
    expect(ids).not.toContain("laundry");
    expect(ids).not.toContain("bedding");
  });

  it("hides green waste bagging when lawn cutting already includes clipping collection", () => {
    const ids = getAvailableAddons("garden", "lawn_cutting").map((a) => a.id);
    expect(ids).not.toContain("green_waste_bags");
  });

  it("hides damage report add-on for guest checkout cleans that already include reporting", () => {
    const ids = getAvailableAddons("cleaning", "guest_checkout").map((a) => a.id);
    expect(ids).not.toContain("damage_report");
  });
});
