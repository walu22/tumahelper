import {
  coordsForLusakaArea,
  coordsFromLusakaAddress,
  lusakaCenterCoords,
} from "@/lib/lusaka/area-centroids";
import type { LocationCoords } from "@/lib/lusaka/geolocation";

export function haversineDistanceKm(a: LocationCoords, b: LocationCoords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function workerCoords(worker: { area: string; city?: string }): LocationCoords {
  return (
    coordsForLusakaArea(worker.area) ??
    (worker.city?.toLowerCase().includes("lusaka") ? lusakaCenterCoords() : lusakaCenterCoords())
  );
}

export function customerCoordsForSorting(
  locationCoords: LocationCoords | null,
  locationAddress: string
): LocationCoords | null {
  if (locationCoords) return locationCoords;
  return coordsFromLusakaAddress(locationAddress);
}

export function sortWorkersByProximity<T extends { area: string; city?: string; trust_score?: number }>(
  workers: T[],
  customerCoords: LocationCoords | null
): T[] {
  if (!customerCoords) {
    return [...workers].sort((a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0));
  }

  return [...workers].sort((a, b) => {
    const distA = haversineDistanceKm(customerCoords, workerCoords(a));
    const distB = haversineDistanceKm(customerCoords, workerCoords(b));
    if (Math.abs(distA - distB) < 0.05) {
      return (b.trust_score ?? 0) - (a.trust_score ?? 0);
    }
    return distA - distB;
  });
}
