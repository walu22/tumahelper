import { describe, expect, it } from "vitest";
import { defaultBetweenGuestServiceDetails, defaultServiceDetails } from "./catalog";
import { formatTurnoverFrequency, getServiceScopeRows } from "./utils";

describe("turnover frequency", () => {
  it("defaults between-guest bookings to once-off", () => {
    expect(defaultBetweenGuestServiceDetails().frequency).toBe("once");
  });

  it("includes frequency in scope rows for airbnb cleans", () => {
    const details = {
      ...defaultBetweenGuestServiceDetails(),
      frequency: "weekly" as const,
    };
    const rows = getServiceScopeRows(details);
    expect(rows.some((r) => r.label === "Frequency" && r.value === "Every week")).toBe(true);
  });

  it("formats turnover frequency labels", () => {
    expect(formatTurnoverFrequency("per_checkout")).toBe("After every guest");
    expect(formatTurnoverFrequency(undefined)).toBe("One-time clean");
  });

  it("includes linen preferences in scope rows for airbnb cleans", () => {
    const details = {
      ...defaultBetweenGuestServiceDetails(),
      linenPreferences: ["replace_no_wash", "basket_only"] as const,
    };
    const rows = getServiceScopeRows(details);
    expect(rows.some((r) => r.label === "Linen")).toBe(true);
    expect(rows.find((r) => r.label === "Linen")?.value).toContain("Remake beds only");
    expect(rows.find((r) => r.label === "Linen")?.value).toContain("Collect for laundry basket");
  });
});

describe("housekeeping scope summary", () => {
  it("labels selected duties as Duties, not Add-ons", () => {
    const details = {
      ...defaultServiceDetails("housekeeping"),
      serviceType: "full_day",
      addons: ["laundry", "dishes"],
    };
    const rows = getServiceScopeRows(details);
    expect(rows.some((r) => r.label === "Duties" && r.value.includes("Laundry"))).toBe(true);
    expect(rows.some((r) => r.label === "Add-ons")).toBe(false);
  });

  it("shows visit type instead of bedroom count", () => {
    const details = defaultServiceDetails("housekeeping");
    const rows = getServiceScopeRows(details);
    expect(rows.some((r) => r.label === "Visit")).toBe(true);
    expect(rows.some((r) => r.label === "Home")).toBe(false);
  });
});

describe("cleaning scope summary", () => {
  it("labels cleaning extras as Add-ons", () => {
    const details = {
      ...defaultServiceDetails("cleaning"),
      serviceType: "standard",
      addons: ["oven"],
    };
    const rows = getServiceScopeRows(details);
    expect(rows.some((r) => r.label === "Add-ons")).toBe(true);
    expect(rows.some((r) => r.label === "Duties")).toBe(false);
  });
});
