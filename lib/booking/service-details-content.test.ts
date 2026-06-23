import { describe, expect, it } from "vitest";
import { getServiceType } from "@/lib/services/catalog";
import {
  resolvePrepareBeforeVisit,
  resolvePriceDrivers,
  resolveSelectionSummary,
  WHAT_HAPPENS_NEXT,
} from "./service-details-content";

describe("service-details-content", () => {
  it("uses selection summary from catalog when provided", () => {
    const type = getServiceType("cleaning", "standard");
    expect(type).toBeTruthy();
    expect(resolveSelectionSummary("cleaning", type!)).toContain(
      "Extras like oven, fridge, laundry"
    );
  });

  it("falls back to category price drivers", () => {
    const type = getServiceType("nanny", "day_nanny");
    expect(type).toBeTruthy();
    expect(resolvePriceDrivers("nanny", type!)).toContain("Number and ages of children");
  });

  it("falls back to category prepare notes", () => {
    const type = getServiceType("cleaning", "standard");
    expect(type).toBeTruthy();
    expect(resolvePrepareBeforeVisit("cleaning", type!)).toContain(
      "Please make sure cleaning supplies are available"
    );
  });

  it("defines what happens next copy", () => {
    expect(WHAT_HAPPENS_NEXT.length).toBeGreaterThanOrEqual(4);
    expect(WHAT_HAPPENS_NEXT.join(" ")).toMatch(/Airtel Money/i);
  });
});
