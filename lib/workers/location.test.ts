import { describe, expect, it } from "vitest";
import {
  resolveWorkerStorageCoords,
  workerCoordsForProximity,
} from "./location";

describe("resolveWorkerStorageCoords", () => {
  it("uses explicit coordinates when provided", () => {
    expect(
      resolveWorkerStorageCoords({
        area: "Kabulonga",
        city: "Lusaka",
        locationLat: -15.42,
        locationLng: 28.31,
      })
    ).toEqual({ lat: -15.42, lng: 28.31 });
  });

  it("derives coords from suburb when GPS is missing", () => {
    const coords = resolveWorkerStorageCoords({
      area: "Woodlands",
      city: "Lusaka",
    });
    expect(coords?.lat).toBeCloseTo(-15.4333, 3);
    expect(coords?.lng).toBeCloseTo(28.3, 3);
  });
});

describe("workerCoordsForProximity", () => {
  it("prefers stored database coordinates", () => {
    const coords = workerCoordsForProximity({
      area: "Woodlands",
      city: "Lusaka",
      location_lat: -15.5,
      location_lng: 28.4,
    });
    expect(coords).toEqual({ lat: -15.5, lng: 28.4 });
  });
});
