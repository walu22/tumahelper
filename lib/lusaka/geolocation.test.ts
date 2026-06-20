import { describe, expect, it } from "vitest";
import { isWithinLusakaBbox, geolocationFailureMessage } from "./geolocation";

describe("isWithinLusakaBbox", () => {
  it("accepts coordinates in central Lusaka", () => {
    expect(isWithinLusakaBbox(-15.4167, 28.2833)).toBe(true);
  });

  it("rejects coordinates far outside Lusaka", () => {
    expect(isWithinLusakaBbox(-17.85, 25.86)).toBe(false);
  });
});

describe("geolocationFailureMessage", () => {
  it("returns a helpful message for permission denial", () => {
    expect(geolocationFailureMessage("permission_denied")).toContain("denied");
  });
});
