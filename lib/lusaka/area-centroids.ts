import { LUSAKA_AREAS } from "@/lib/lusaka/places";
import type { LocationCoords } from "@/lib/lusaka/geolocation";

/** Approximate centroids for Lusaka suburbs (used for worker proximity sorting). */
const AREA_CENTROIDS: Record<string, LocationCoords> = {
  kabulonga: { lat: -15.4167, lng: 28.3167 },
  woodlands: { lat: -15.4333, lng: 28.3 },
  roma: { lat: -15.4083, lng: 28.2917 },
  "rhodes park": { lat: -15.4, lng: 28.2833 },
  longacres: { lat: -15.3944, lng: 28.3056 },
  "ibex hill": { lat: -15.4278, lng: 28.3389 },
  meanwood: { lat: -15.3889, lng: 28.3278 },
  kalundu: { lat: -15.4111, lng: 28.3444 },
  avondale: { lat: -15.3833, lng: 28.3 },
  chainda: { lat: -15.3611, lng: 28.35 },
  chelstone: { lat: -15.3667, lng: 28.3833 },
  chilenje: { lat: -15.4444, lng: 28.35 },
  chudleigh: { lat: -15.4222, lng: 28.2778 },
  emmasdale: { lat: -15.3556, lng: 28.3222 },
  fairview: { lat: -15.3778, lng: 28.2889 },
  foxdale: { lat: -15.4306, lng: 28.3194 },
  "handsworth park": { lat: -15.4194, lng: 28.2861 },
  jesmondine: { lat: -15.4056, lng: 28.2694 },
  kamwala: { lat: -15.3889, lng: 28.2778 },
  "leopards hill": { lat: -15.45, lng: 28.3667 },
  libala: { lat: -15.4389, lng: 28.3611 },
  lilayi: { lat: -15.4722, lng: 28.3167 },
  makeni: { lat: -15.4611, lng: 28.2944 },
  "mass media": { lat: -15.3972, lng: 28.3194 },
  mutendere: { lat: -15.3722, lng: 28.3667 },
  "new kasama": { lat: -15.4056, lng: 28.3556 },
  northmead: { lat: -15.3917, lng: 28.2944 },
  olympia: { lat: -15.3833, lng: 28.3111 },
  ridgeway: { lat: -15.425, lng: 28.3083 },
  "salama park": { lat: -15.3583, lng: 28.3417 },
  sunningdale: { lat: -15.4139, lng: 28.3278 },
  "thorn park": { lat: -15.4028, lng: 28.3028 },
  "woodlands extension": { lat: -15.4417, lng: 28.3083 },
};

const LUSAKA_CENTER: LocationCoords = { lat: -15.4167, lng: 28.2833 };

function normalizeArea(value: string): string {
  return value.trim().toLowerCase();
}

export function coordsForLusakaArea(area: string): LocationCoords | null {
  const key = normalizeArea(area);
  if (AREA_CENTROIDS[key]) return AREA_CENTROIDS[key];

  for (const name of LUSAKA_AREAS) {
    if (normalizeArea(name) === key) {
      return AREA_CENTROIDS[normalizeArea(name)] ?? null;
    }
  }

  return null;
}

/** Best-effort coords from a free-text Lusaka address (matches known suburb names). */
export function coordsFromLusakaAddress(address: string): LocationCoords | null {
  const lower = address.toLowerCase();
  for (const name of LUSAKA_AREAS) {
    if (lower.includes(name.toLowerCase())) {
      return coordsForLusakaArea(name) ?? LUSAKA_CENTER;
    }
  }
  return null;
}

export function lusakaCenterCoords(): LocationCoords {
  return LUSAKA_CENTER;
}
