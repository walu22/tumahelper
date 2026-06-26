import {
  defaultServiceDetails,
  getAirbnbCleaningTypes,
  getCookingTypes,
  getGardenTypes,
  getHandymanTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getNannyTypes,
  getResidentialCleaningTypes,
  isAirbnbCleaningType,
  SERVICE_CATALOG,
  type ServiceCategoryKey,
} from "@/lib/services/catalog";
import { PLUMBING_JOB_TYPES } from "@/lib/services/handyman-plumbing";
import { buildBookUrl } from "@/lib/services/utils";
import { HERO_CATEGORIES } from "@/lib/landing/content";

export type HeroSearchResult = {
  id: string;
  label: string;
  categoryLabel: string;
  href: string;
  searchText: string;
};

const EXTRA_KEYWORDS: Record<string, string> = {
  nanny: "babysitter babysitting childcare child care kids",
  cleaning: "clean cleaner house clean home maid",
  housekeeping: "housekeeper domestic helper dishes tidy",
  cooking: "cook chef meals lunch dinner meal prep",
  laundry: "wash fold iron ironing clothes",
  garden: "gardener lawn yard outside outdoor",
  handyman: "repair fix handyman home repairs maintenance",
  short_stay: "airbnb guesthouse rental turnover between guests",
  plumbing: "plumber tap drain toilet leak pipe",
  electrical: "electrician lights switch socket wiring",
  mounting: "tv shelf mirror hang wall mount",
  babysitting: "babysitter nanny childcare",
  guest_checkout: "airbnb checkout turnover short stay",
};

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function bookHref(category: ServiceCategoryKey, serviceType: string): string {
  if (category === "cleaning" && isAirbnbCleaningType(serviceType)) {
    return `/customer/book/airbnb?type=${encodeURIComponent(serviceType)}`;
  }
  return buildBookUrl({
    ...defaultServiceDetails(category),
    serviceType,
  });
}

function pushType(
  results: HeroSearchResult[],
  category: ServiceCategoryKey,
  type: { id: string; label: string; description: string; tabLabel?: string },
  extraKeywords = ""
) {
  results.push({
    id: `${category}-${type.id}`,
    label: type.tabLabel ?? type.label,
    categoryLabel: SERVICE_CATALOG[category].title,
    href: bookHref(category, type.id),
    searchText: [
      type.label,
      type.tabLabel,
      type.description,
      SERVICE_CATALOG[category].title,
      EXTRA_KEYWORDS[type.id],
      EXTRA_KEYWORDS[category],
      extraKeywords,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  });
}

export function buildHeroSearchIndex(): HeroSearchResult[] {
  const results: HeroSearchResult[] = [];

  for (const category of HERO_CATEGORIES) {
    results.push({
      id: `category-${category.id}`,
      label: category.label,
      categoryLabel: "Browse services",
      href: category.href,
      searchText: [
        category.label,
        category.subtitle,
        EXTRA_KEYWORDS[category.id],
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const type of getNannyTypes()) pushType(results, "nanny", type);
  for (const type of getResidentialCleaningTypes()) pushType(results, "cleaning", type);
  for (const type of getHousekeepingTypes()) pushType(results, "housekeeping", type);
  for (const type of getCookingTypes()) pushType(results, "cooking", type);
  for (const type of getLaundryTypes()) pushType(results, "laundry", type);
  for (const type of getGardenTypes()) pushType(results, "garden", type);
  for (const type of getHandymanTypes()) pushType(results, "handyman", type);
  for (const type of getAirbnbCleaningTypes()) {
    pushType(results, "cleaning", type, EXTRA_KEYWORDS.short_stay);
  }

  for (const job of PLUMBING_JOB_TYPES) {
    results.push({
      id: `plumbing-${job.id}`,
      label: job.label,
      categoryLabel: "Plumbing",
      href: bookHref("handyman", "plumbing"),
      searchText: [
        job.label,
        "plumbing plumber handyman",
        EXTRA_KEYWORDS.plumbing,
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  return results;
}

function scoreResult(result: HeroSearchResult, query: string): number {
  const label = result.label.toLowerCase();
  const category = result.categoryLabel.toLowerCase();
  const haystack = result.searchText;

  if (label === query) return 120;
  if (label.startsWith(query)) return 100;
  if (category.startsWith(query)) return 85;
  if (label.includes(query)) return 75;
  if (haystack.includes(query)) return 60;

  const tokens = query.split(" ").filter(Boolean);
  if (tokens.length > 1 && tokens.every((token) => haystack.includes(token))) {
    return 50;
  }

  return 0;
}

export function searchHeroServices(query: string, limit = 8): HeroSearchResult[] {
  const normalized = normalizeQuery(query);
  const index = buildHeroSearchIndex();

  if (!normalized) {
    return getDefaultHeroSearchResults(limit);
  }

  const seen = new Set<string>();
  return index
    .map((item) => ({ item, score: scoreResult(item, normalized) }))
    .filter(({ score, item }) => {
      if (score <= 0 || seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
    .slice(0, limit)
    .map(({ item }) => item);
}

export const HERO_POPULAR_SEARCHES = [
  "House Cleaning",
  "Nanny",
  "Plumbing",
  "Cooking",
  "Laundry",
  "Short-Stay Cleaning",
  "Electrical",
  "Garden",
] as const;

const POPULAR_SEARCH_TARGETS: Record<
  (typeof HERO_POPULAR_SEARCHES)[number],
  { category: ServiceCategoryKey; serviceType: string; label: string; categoryLabel: string }
> = {
  "House Cleaning": {
    category: "cleaning",
    serviceType: "standard",
    label: "House Cleaning",
    categoryLabel: "Cleaning",
  },
  Nanny: {
    category: "nanny",
    serviceType: "day_nanny",
    label: "Nanny",
    categoryLabel: "Nannies",
  },
  Plumbing: {
    category: "handyman",
    serviceType: "plumbing",
    label: "Plumbing",
    categoryLabel: "Handyman",
  },
  Cooking: {
    category: "cooking",
    serviceType: "dinner",
    label: "Cooking",
    categoryLabel: "Cooking & meals",
  },
  Laundry: {
    category: "laundry",
    serviceType: "wash_fold",
    label: "Laundry",
    categoryLabel: "Laundry & ironing",
  },
  "Short-Stay Cleaning": {
    category: "cleaning",
    serviceType: "guest_checkout",
    label: "Short-Stay Cleaning",
    categoryLabel: "Short-stay cleaning",
  },
  Electrical: {
    category: "handyman",
    serviceType: "electrical",
    label: "Electrical",
    categoryLabel: "Handyman",
  },
  Garden: {
    category: "garden",
    serviceType: "lawn_cutting",
    label: "Garden",
    categoryLabel: "Garden & yard",
  },
};

export function resolvePopularHeroSearch(
  term: (typeof HERO_POPULAR_SEARCHES)[number] | string
): HeroSearchResult | null {
  const target = POPULAR_SEARCH_TARGETS[term as (typeof HERO_POPULAR_SEARCHES)[number]];
  if (target) {
    return {
      id: `popular-${target.category}-${target.serviceType}`,
      label: target.label,
      categoryLabel: target.categoryLabel,
      href: bookHref(target.category, target.serviceType),
      searchText: term.toLowerCase(),
    };
  }

  const results = searchHeroServices(term, 12);
  return (
    results.find((item) => item.href.startsWith("/customer/book")) ??
    results[0] ??
    null
  );
}

export function getDefaultHeroSearchResults(limit = 8): HeroSearchResult[] {
  return HERO_POPULAR_SEARCHES.map((term) => resolvePopularHeroSearch(term))
    .filter((result): result is HeroSearchResult => result != null)
    .slice(0, limit);
}

/** Booking-page search: only deep links into the booking wizard. */
export function searchBookServices(query: string, limit = 8): HeroSearchResult[] {
  const pool = query.trim()
    ? searchHeroServices(query, limit + 6)
    : getDefaultHeroSearchResults(limit + 6);

  return pool
    .filter((result) => result.href.startsWith("/customer/book"))
    .slice(0, limit);
}
