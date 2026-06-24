import { describe, expect, it } from "vitest";
import {
  resolvePopularHeroSearch,
  searchHeroServices,
} from "./hero-search";

describe("searchHeroServices", () => {
  it("returns popular bookable services when the query is empty", () => {
    const results = searchHeroServices("");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.href).toMatch(/^\/customer\/book/);
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

describe("resolvePopularHeroSearch", () => {
  it("links popular pills straight into booking", () => {
    expect(resolvePopularHeroSearch("Plumbing")?.href).toContain("handyman");
    expect(resolvePopularHeroSearch("Plumbing")?.href).toContain("plumbing");
    expect(resolvePopularHeroSearch("Short-Stay Cleaning")?.href).toContain("airbnb");
    expect(resolvePopularHeroSearch("Nanny")?.href).toContain("category=nanny");
  });
});
