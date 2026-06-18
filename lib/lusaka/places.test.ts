import { describe, expect, it } from "vitest";
import { buildAddressWithArea, finalizeLusakaAddress, searchLusakaPlaces } from "./places";

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

describe("finalizeLusakaAddress", () => {
  it("appends Lusaka and Zambia to a short address", () => {
    expect(finalizeLusakaAddress("Plot 10, Roma")).toBe("Plot 10, Roma, Lusaka, Zambia");
  });

  it("deduplicates Lusaka when the street already includes it", () => {
    expect(finalizeLusakaAddress("Simon Mwansa Kapwepwe Avenue, Chainda, Lusaka")).toBe(
      "Simon Mwansa Kapwepwe Avenue, Chainda, Lusaka, Zambia"
    );
  });

  it("strips district suffix and includes an optional unit", () => {
    expect(finalizeLusakaAddress("Plot 12, Chainda Lusaka", "Unit 4")).toBe(
      "Plot 12, Chainda, Unit 4, Lusaka, Zambia"
    );
  });
});
