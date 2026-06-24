import type { LusakaPlaceSuggestion } from "@/lib/lusaka/places";

export interface AddressSuggestion {
  id: string;
  label: string;
  sublabel?: string;
  fillValue: string;
  source: "street" | "area";
}

interface PhotonFeature {
  properties?: {
    name?: string;
    street?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    type?: string;
    housenumber?: string;
  };
}

const LUSAKA_LAT = -15.4167;
const LUSAKA_LON = 28.2833;

export interface ReverseGeocodeResult {
  streetAddress: string;
  label: string;
  lat: number;
  lng: number;
}

function formatPhotonSuggestion(feature: PhotonFeature): AddressSuggestion | null {
  const props = feature.properties;
  if (!props) return null;
  if (props.countrycode && props.countrycode !== "ZM") return null;

  const city = props.city ?? props.county ?? "";
  if (city && !city.toLowerCase().includes("lusaka")) return null;

  const name = props.name ?? props.street;
  if (!name) return null;

  const district = props.district?.replace(/\s+Lusaka$/i, "").trim();
  const parts = [name];
  if (district && !name.toLowerCase().includes(district.toLowerCase())) {
    parts.push(district);
  }
  parts.push("Lusaka");

  const fillValue = parts.join(", ");
  const label = district ? `${name}, ${district}` : name;

  return {
    id: `street-${name}-${district ?? "lusaka"}`.toLowerCase().replace(/\s+/g, "-"),
    label,
    sublabel: "Lusaka, Zambia",
    fillValue,
    source: "street",
  };
}

export async function fetchStreetSuggestions(query: string): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lat", String(LUSAKA_LAT));
  url.searchParams.set("lon", String(LUSAKA_LON));
  url.searchParams.set("lang", "en");
  url.searchParams.set("bbox", "28.12,-15.58,28.52,-15.22");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as { features?: PhotonFeature[] };
  const seen = new Set<string>();
  const results: AddressSuggestion[] = [];

  for (const feature of data.features ?? []) {
    const suggestion = formatPhotonSuggestion(feature);
    if (!suggestion) continue;
    const key = suggestion.fillValue.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(suggestion);
    if (results.length >= 6) break;
  }

  return results;
}

export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult | null> {
  const url = new URL("https://photon.komoot.io/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("lang", "en");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { features?: PhotonFeature[] };

  for (const feature of data.features ?? []) {
    const suggestion = formatPhotonSuggestion(feature);
    if (suggestion) {
      return {
        streetAddress: suggestion.fillValue,
        label: suggestion.label,
        lat,
        lng,
      };
    }
  }

  return {
    streetAddress: "Current location, Lusaka",
    label: "Current location",
    lat,
    lng,
  };
}

export function areaSuggestionsToAddressSuggestions(
  areas: LusakaPlaceSuggestion[]
): AddressSuggestion[] {
  return areas.map((area) => ({
    id: `area-${area.area.toLowerCase().replace(/\s+/g, "-")}`,
    label: area.area,
    sublabel: `${area.area}, Lusaka`,
    fillValue: area.fillValue,
    source: "area" as const,
  }));
}

export function mergeAddressSuggestions(
  streets: AddressSuggestion[],
  areas: AddressSuggestion[],
  limit = 8
): AddressSuggestion[] {
  const seen = new Set<string>();
  const merged: AddressSuggestion[] = [];

  for (const item of [...streets, ...areas]) {
    const key = item.fillValue.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
    if (merged.length >= limit) break;
  }

  return merged;
}
