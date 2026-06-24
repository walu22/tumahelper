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

/** True when the user has typed a street/plot fragment, not just an area search prefix. */
function looksLikeStreetOrPlot(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/\d/.test(trimmed)) return true;
  if (trimmed.includes(",")) return true;
  if (trimmed.split(/\s+/).length >= 2) return true;
  return false;
}

/** True when the typed text is only helping filter area names in autocomplete. */
function isAreaSearchQuery(current: string, area: string): boolean {
  const currentLower = normalize(current);
  const areaLower = normalize(area);
  if (!currentLower) return true;
  if (looksLikeStreetOrPlot(current)) return false;
  if (areaLower.startsWith(currentLower)) return true;
  if (currentLower.length <= 3 && areaLower.includes(currentLower)) return true;
  return false;
}

export function buildAddressWithArea(current: string, area: string): string {
  const trimmed = current.trim();
  if (!trimmed) return area;
  if (normalize(trimmed).includes(normalize(area))) return trimmed;
  if (isAreaSearchQuery(trimmed, area)) return area;
  if (trimmed.endsWith(",")) return `${trimmed} ${area}`;
  return `${trimmed}, ${area}`;
}

/** Normalize a Lusaka address: dedupe parts and ensure a single trailing "Lusaka, Zambia". */
export function finalizeLusakaAddress(street: string, unit?: string): string {
  const streetPart = street.trim();
  if (!streetPart) return "";

  const unitPart = unit?.trim();
  const segments: string[] = [];

  for (const chunk of streetPart.split(",")) {
    const trimmed = chunk.trim();
    if (trimmed) segments.push(trimmed);
  }
  if (unitPart) segments.push(unitPart);

  const parts: string[] = [];
  const seen = new Set<string>();

  for (let segment of segments) {
    segment = segment.replace(/\s+Lusaka$/i, "").trim();
    const key = segment.toLowerCase();
    if (!segment || key === "lusaka" || key === "zambia" || seen.has(key)) continue;
    seen.add(key);
    parts.push(segment);
  }

  parts.push("Lusaka", "Zambia");
  return parts.join(", ");
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
