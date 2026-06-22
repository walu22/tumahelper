import {
  coordsForLusakaArea,
  lusakaCenterCoords,
} from "@/lib/lusaka/area-centroids";
import type { LocationCoords } from "@/lib/lusaka/geolocation";

export type WorkerLocationInput = {
  area: string;
  city?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
};

/** Coords to store on worker_profiles (explicit GPS or suburb centroid). */
export function resolveWorkerStorageCoords(
  input: WorkerLocationInput
): LocationCoords | null {
  const lat = input.locationLat;
  const lng = input.locationLng;
  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  const fromArea = coordsForLusakaArea(input.area);
  if (fromArea) return fromArea;

  if (input.city?.trim().toLowerCase().includes("lusaka")) {
    return lusakaCenterCoords();
  }

  return null;
}

/** Coords for proximity sorting (DB values first, then suburb fallback). */
export function workerCoordsForProximity(worker: {
  area: string;
  city?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
  locationLat?: number | null;
  locationLng?: number | null;
}): LocationCoords {
  const lat = worker.location_lat ?? worker.locationLat;
  const lng = worker.location_lng ?? worker.locationLng;
  if (lat != null && lng != null && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))) {
    return { lat: Number(lat), lng: Number(lng) };
  }

  return (
    resolveWorkerStorageCoords({ area: worker.area, city: worker.city }) ??
    lusakaCenterCoords()
  );
}
