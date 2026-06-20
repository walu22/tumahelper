/** Lusaka service area bounding box (lon_min, lat_min, lon_max, lat_max). */
export const LUSAKA_BBOX = {
  minLon: 28.12,
  minLat: -15.58,
  maxLon: 28.52,
  maxLat: -15.22,
} as const;

export interface LocationCoords {
  lat: number;
  lng: number;
}

export type GeolocationFailure =
  | "unsupported"
  | "permission_denied"
  | "unavailable"
  | "timeout"
  | "outside_lusaka"
  | "reverse_geocode_failed";

export function isWithinLusakaBbox(lat: number, lng: number): boolean {
  return (
    lat >= LUSAKA_BBOX.minLat &&
    lat <= LUSAKA_BBOX.maxLat &&
    lng >= LUSAKA_BBOX.minLon &&
    lng <= LUSAKA_BBOX.maxLon
  );
}

export function geolocationFailureMessage(code: GeolocationFailure): string {
  switch (code) {
    case "unsupported":
      return "Your browser does not support location services.";
    case "permission_denied":
      return "Location access was denied. Allow location in your browser settings, or type your address manually.";
    case "unavailable":
      return "Could not detect your location. Try again or enter your address manually.";
    case "timeout":
      return "Finding your location took too long. Try again or enter your address manually.";
    case "outside_lusaka":
      return "Your current location appears to be outside Lusaka. TumaHelper currently serves Lusaka homes only.";
    case "reverse_geocode_failed":
      return "We found your location but could not match it to a street address. Try typing your address instead.";
  }
}

export function getCurrentPosition(
  options?: PositionOptions
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("permission_denied"));
          return;
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error("unavailable"));
          return;
        }
        if (error.code === error.TIMEOUT) {
          reject(new Error("timeout"));
          return;
        }
        reject(new Error("unavailable"));
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 60_000,
        ...options,
      }
    );
  });
}
