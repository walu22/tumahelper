import { describe, expect, it } from "vitest";
import { searchHeroServices } from "./hero-search";

describe("searchHeroServices", () => {
  it("returns popular categories when the query is empty", () => {
    const results = searchHeroServices("");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.categoryLabel).toBe("Browse services");
  });

  it("finds plumbing-related services", () => {
    const results = searchHeroServices("plumb");
    expect(results.some((item) => item.label.toLowerCase().includes("plumb"))).toBe(true);
  });

  it("finds nanny services from babysitter-style queries", () => {
    const results = searchHeroServices("babysit");
    expect(
      results.some(
        (item) =>
          item.label.toLowerCase().includes("nanny") ||
          item.searchText.includes("babysit")
      )
    ).toBe(true);
  });

  it("finds short-stay cleaning from airbnb queries", () => {
    const results = searchHeroServices("airbnb");
    expect(results.length).toBeGreaterThan(0);
  });
});
