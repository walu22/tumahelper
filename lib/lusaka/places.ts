/** Popular Lusaka areas for short-stay and residential bookings */
export const LUSAKA_POPULAR_AREAS = [
  "Kabulonga",
  "Woodlands",
  "Roma",
  "Rhodes Park",
  "Longacres",
  "Ibex Hill",
  "Meanwood",
  "Kalundu",
] as const;

/** Broader list for address search across Lusaka */
export const LUSAKA_AREAS = [
  ...LUSAKA_POPULAR_AREAS,
  "Avondale",
  "Chainda",
  "Chelstone",
  "Chilenje",
  "Chudleigh",
  "Emmasdale",
  "Fairview",
  "Foxdale",
  "Handsworth Park",
  "Jesmondine",
  "Kamwala",
  "Leopards Hill",
  "Libala",
  "Lilayi",
  "Makeni",
  "Mass Media",
  "Mutendere",
  "New Kasama",
  "Northmead",
  "Olympia",
  "Ridgeway",
  "Salama Park",
  "Sunningdale",
  "Thorn Park",
  "Woodlands Extension",
] as const;

export interface LusakaPlaceSuggestion {
  area: string;
  /** What to put in the address field when selected */
  fillValue: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function buildAddressWithArea(current: string, area: string): string {
  const trimmed = current.trim();
  if (!trimmed) return area;
  if (normalize(trimmed).includes(normalize(area))) return trimmed;
  if (trimmed.endsWith(",")) return `${trimmed} ${area}`;
  return `${trimmed}, ${area}`;
}

/** Ranked place suggestions for the address field */
export function searchLusakaPlaces(query: string, limit = 8): LusakaPlaceSuggestion[] {
  const q = normalize(query);

  const ranked = LUSAKA_AREAS.map((area) => {
    const areaLower = area.toLowerCase();
    let score = 0;

    if (!q) {
      const popularIndex = LUSAKA_POPULAR_AREAS.indexOf(
        area as (typeof LUSAKA_POPULAR_AREAS)[number]
      );
      score = popularIndex >= 0 ? 100 - popularIndex : 10;
    } else if (areaLower.startsWith(q)) {
      score = 90;
    } else if (areaLower.includes(q)) {
      score = 70;
    } else if (q.includes(areaLower)) {
      score = 50;
    } else {
      const parts = q.split(/[\s,]+/).filter(Boolean);
      if (parts.some((part) => areaLower.startsWith(part) || areaLower.includes(part))) {
        score = 40;
      }
    }

    return { area, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.area.localeCompare(b.area))
    .slice(0, limit);

  return ranked.map(({ area }) => ({
    area,
    fillValue: buildAddressWithArea(query, area),
  }));
}
