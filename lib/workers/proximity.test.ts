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

  it("prefers stored database coordinates over suburb fallback", () => {
    const workers = [
      {
        area: "Woodlands",
        city: "Lusaka",
        trust_score: 70,
        full_name: "Near",
        location_lat: -15.417,
        location_lng: 28.317,
      },
      {
        area: "Kabulonga",
        city: "Lusaka",
        trust_score: 90,
        full_name: "Far",
        location_lat: -15.45,
        location_lng: 28.35,
      },
    ];
    const sorted = sortWorkersByProximity(workers, { lat: -15.4167, lng: 28.3167 });
    expect(sorted[0]?.full_name).toBe("Near");
  });
});
