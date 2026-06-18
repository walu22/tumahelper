import { describe, expect, it } from "vitest";
import { defaultBetweenGuestServiceDetails } from "./catalog";
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
});
