import { describe, expect, it } from "vitest";
import { buildAddressWithArea, searchLusakaPlaces } from "./places";

describe("searchLusakaPlaces", () => {
  it("returns popular areas when the query is empty", () => {
    const results = searchLusakaPlaces("");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.area).toBe("Kabulonga");
  });

  it("matches areas as the user types", () => {
    const results = searchLusakaPlaces("wood");
    expect(results.some((r) => r.area === "Woodlands")).toBe(true);
  });

  it("builds a full address when an area is selected", () => {
    expect(buildAddressWithArea("Plot 10", "Kabulonga")).toBe("Plot 10, Kabulonga");
    expect(buildAddressWithArea("", "Roma")).toBe("Roma");
  });
});
