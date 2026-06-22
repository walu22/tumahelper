import { describe, expect, it } from "vitest";
import { sortWorkersByProximity } from "./proximity";

describe("sortWorkersByProximity", () => {
  const workers = [
    { area: "Woodlands", city: "Lusaka", trust_score: 90, full_name: "A" },
    { area: "Kabulonga", city: "Lusaka", trust_score: 70, full_name: "B" },
    { area: "Chilenje", city: "Lusaka", trust_score: 80, full_name: "C" },
  ];

  it("sorts by trust score when customer coords are missing", () => {
    const sorted = sortWorkersByProximity(workers, null);
    expect(sorted.map((w) => w.full_name)).toEqual(["A", "C", "B"]);
  });

  it("prefers workers nearer to the customer", () => {
    const sorted = sortWorkersByProximity(workers, { lat: -15.4167, lng: 28.3167 });
    expect(sorted[0]?.area).toBe("Kabulonga");
  });
});
