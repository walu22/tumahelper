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

  it("does not prepend a single-letter area search to the selected suburb", () => {
    expect(buildAddressWithArea("J", "Jesmondine")).toBe("Jesmondine");
    expect(buildAddressWithArea("J", "Chilenje")).toBe("Chilenje");
  });

  it("does not prepend a short area search prefix to the selected suburb", () => {
    expect(buildAddressWithArea("wood", "Woodlands")).toBe("Woodlands");
  });

  it("returns area-only fill values for partial suburb searches", () => {
    const results = searchLusakaPlaces("J");
    const jesmondine = results.find((r) => r.area === "Jesmondine");
    expect(jesmondine?.fillValue).toBe("Jesmondine");
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
