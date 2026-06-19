export type ServiceCategoryKey = "cleaning" | "nanny";

export interface ServiceTypeOption {
  id: string;
  label: string;
  /** Shorter label for horizontal service tabs on mobile */
  tabLabel?: string;
  description: string;
  included: string[];
  notIncluded?: string[];
  /** Customer-facing pricing copy shown in booking (overrides numeric range when set). */
  pricingHint?: string;
  defaultHours: number;
  priceHintMin: number;
  priceHintMax: number;
}

export interface ServiceAddonOption {
  id: string;
  label: string;
  description: string;
  priceHint: number;
  allowedTypes?: string[];
}

export interface ServiceCatalogEntry {
  key: ServiceCategoryKey;
  title: string;
  tagline: string;
  bookParam: string;
  types: ServiceTypeOption[];
  addons: ServiceAddonOption[];
  scopeLabel: "home" | "children";
}

export interface ServiceDetails {
  category: ServiceCategoryKey;
  serviceType: string;
  durationHours: number;
  bedrooms?: number;
  bathrooms?: number;
  children?: number;
  childAgeGroups?: string[];
  addons: string[];
  /** Between-guest / short-stay turnover cadence */
  frequency?: TurnoverFrequency;
  /** Airbnb: how soon the host needs the clean */
  whenPreference?: "today" | "last_minute" | "tomorrow_later";
  /** Airbnb: how linen should be handled (one or more) */
  linenPreferences?: LinenPreference[];
  /** @deprecated Use linenPreferences */
  linenPreference?: LinenPreference;
}

export type LinenPreference = "replace_no_wash" | "wash_repack" | "basket_only";

export type TurnoverFrequency = "once" | "per_checkout" | "weekly" | "every_2_weeks";

export const TURNOVER_FREQUENCY_OPTIONS: {
  id: TurnoverFrequency;
  label: string;
  description: string;
}[] = [
  {
    id: "once",
    label: "One-time clean",
    description: "One clean before your next guest arrives",
  },
  {
    id: "per_checkout",
    label: "After every guest",
    description: "Book again each time guests check out",
  },
  {
    id: "weekly",
    label: "Every week",
    description: "Same day each week for steady bookings",
  },
  {
    id: "every_2_weeks",
    label: "Every two weeks",
    description: "Fortnightly cleans for quieter listings",
  },
];

export const CHILD_AGE_GROUPS = [
  { id: "0-2", label: "0–2 years (infant)" },
  { id: "3-5", label: "3–5 years (toddler)" },
  { id: "6-12", label: "6–12 years (school age)" },
  { id: "13+", label: "13+ (teen)" },
] as const;

export const DURATION_OPTIONS = [3, 4, 6, 8] as const;

/** Home cleaning types shown in tab picker (excludes Airbnb — separate entry). */
export const RESIDENTIAL_CLEANING_TYPE_IDS = [
  "standard",
  "apartment",
  "deep",
  "spring",
  "move",
  "garage",
] as const;

const HOME_CLEAN_ADDON_TYPES = ["standard", "spring", "apartment", "deep"] as const;

/** Airbnb / short-stay cleaning types (separate hero entry from residential cleaning). */
export const AIRBNB_CLEANING_TYPE_IDS = [
  "guest_checkout",
  "same_day_turnaround",
  "deep_airbnb",
  "linen_setup",
] as const;

export const AIRBNB_ADDON_TYPES = [...AIRBNB_CLEANING_TYPE_IDS] as const;

export const NANNY_TYPE_IDS = [
  "day_nanny",
  "babysitter",
  "infant_care",
  "after_school",
  "weekend_nanny",
] as const;

export const LEGACY_SERVICE_TYPE_ALIASES: Record<string, string> = {
  airbnb: "guest_checkout",
  babysitting: "babysitter",
  newborn: "infant_care",
  regular: "day_nanny",
};

export function normalizeServiceType(_category: ServiceCategoryKey, typeId: string): string {
  return LEGACY_SERVICE_TYPE_ALIASES[typeId] ?? typeId;
}

export function isAirbnbCleaningType(serviceType: string): boolean {
  return (
    AIRBNB_CLEANING_TYPE_IDS.includes(
      serviceType as (typeof AIRBNB_CLEANING_TYPE_IDS)[number]
    ) || serviceType === "airbnb"
  );
}

export function getResidentialCleaningTypes(): ServiceTypeOption[] {
  const byId = new Map(
    SERVICE_CATALOG.cleaning.types
      .filter((t) => (RESIDENTIAL_CLEANING_TYPE_IDS as readonly string[]).includes(t.id))
      .map((t) => [t.id, t] as const)
  );
  return RESIDENTIAL_CLEANING_TYPE_IDS.map((id) => byId.get(id)).filter(
    (t): t is ServiceTypeOption => t !== undefined
  );
}

export function getAirbnbCleaningTypes(): ServiceTypeOption[] {
  const byId = new Map(SERVICE_CATALOG.cleaning.types.map((t) => [t.id, t] as const));
  return AIRBNB_CLEANING_TYPE_IDS.map((id) => byId.get(id)).filter(
    (t): t is ServiceTypeOption => t !== undefined
  );
}

export function getNannyTypes(): ServiceTypeOption[] {
  const byId = new Map(SERVICE_CATALOG.nanny.types.map((t) => [t.id, t] as const));
  return NANNY_TYPE_IDS.map((id) => byId.get(id)).filter(
    (t): t is ServiceTypeOption => t !== undefined
  );
}

export const SERVICE_CATALOG: Record<ServiceCategoryKey, ServiceCatalogEntry> = {
  cleaning: {
    key: "cleaning",
    title: "House cleaning",
    tagline:
      "House, apartment, deep, spring, move-in/out, and garage & outside cleans for Lusaka homes",
    bookParam: "cleaning",
    scopeLabel: "home",
    types: [
      {
        id: "standard",
        label: "House cleaning",
        tabLabel: "House cleaning",
        description:
          "Regular cleaning for homes, including floors, kitchen, bathroom, bedrooms, and general tidying.",
        included: [
          "Sweeping and mopping floors",
          "Dusting visible surfaces",
          "Kitchen counters and sink",
          "Toilets, bathroom floor, sink, and mirror",
          "Making beds",
          "Tidying living room and bedrooms",
          "Emptying small indoor bins",
          "General visible cleaning",
        ],
        notIncluded: [
          "Moving heavy furniture",
          "Inside cupboards, fridge, or oven (unless add-on)",
          "Scrubbing heavy stains or washing walls",
          "Laundry and ironing (unless add-on)",
          "Dish washing (unless add-on)",
          "Outside yard work",
        ],
        defaultHours: 4,
        priceHintMin: 350,
        priceHintMax: 550,
      },
      {
        id: "apartment",
        label: "Apartment cleaning",
        tabLabel: "Apartment cleaning",
        description:
          "Cleaning for flats, apartments, and smaller homes, including kitchen, bathroom, living area, bedroom, and balcony.",
        included: [
          "Sweeping and mopping floors",
          "Dusting visible surfaces",
          "Kitchen counter and sink cleaning",
          "Bathroom cleaning",
          "Bedroom and living room tidying",
          "Balcony sweeping, if applicable",
          "Small bin emptying",
          "Making beds",
        ],
        notIncluded: [
          "Deep or move-out cleaning",
          "Laundry and ironing (unless add-on)",
          "Dish washing (unless add-on)",
          "Shared complex hallways or stairwells",
          "Outside yard work",
          "Exterior window cleaning",
        ],
        defaultHours: 3,
        priceHintMin: 280,
        priceHintMax: 420,
      },
      {
        id: "deep",
        label: "Deep cleaning",
        tabLabel: "Deep cleaning",
        description:
          "Detailed cleaning for built-up dirt, bathrooms, kitchen, tiles, corners, doors, handles, and hard-to-reach areas.",
        included: [
          "Everything in house cleaning",
          "Scrubbing bathroom tiles",
          "Detailed toilet, shower, bathtub, and sink cleaning",
          "Kitchen tiles and stove area",
          "Cupboard doors outside",
          "Skirting boards and reachable cobwebs",
          "Dusting hard-to-reach but safe areas",
          "Cleaning behind light movable furniture",
          "Doors, handles, switches, and window sills",
          "More detailed floor scrubbing",
        ],
        notIncluded: [
          "Post-construction dust removal",
          "Heavy mould treatment or pest/fumigation cleaning",
          "Carpet or upholstery machine cleaning",
          "High windows, roofs, or climbing work",
          "Moving heavy wardrobes, fridges, or beds",
          "Inside oven, fridge, or cupboards (unless add-on)",
        ],
        defaultHours: 6,
        priceHintMin: 500,
        priceHintMax: 800,
      },
      {
        id: "spring",
        label: "Spring cleaning",
        tabLabel: "Spring cleaning",
        description:
          "A full home refresh, including general cleaning, dusting, organising visible clutter, interior windows, and areas normally skipped.",
        included: [
          "Full general cleaning of the house",
          "Dusting and wiping multiple rooms",
          "Cupboard and wardrobe doors outside",
          "Interior windows",
          "Helping organise visible clutter",
          "Cleaning under beds where reachable",
          "Removing reachable cobwebs",
          "Wiping doors, handles, and frames",
        ],
        notIncluded: [
          "Heavy lifting or moving large furniture",
          "Throwing away items without your approval",
          "Detailed cupboard packing (unless add-on)",
          "Washing all clothes (unless laundry add-on)",
          "Deep appliance cleaning (unless add-on)",
          "Balcony or verandah (unless add-on)",
          "Professional carpet or upholstery cleaning",
        ],
        defaultHours: 6,
        priceHintMin: 500,
        priceHintMax: 750,
      },
      {
        id: "move",
        label: "Move-in / move-out cleaning",
        tabLabel: "Move-in / out",
        description:
          "Cleaning for empty or nearly empty homes before moving in, after moving out, or before handover.",
        included: [
          "Sweeping and mopping all rooms",
          "Thorough bathroom cleaning",
          "Kitchen surfaces and sink",
          "Inside empty cupboards and wardrobes",
          "Interior windows",
          "Dusting doors, frames, and skirting",
          "Sinks, taps, and tiles",
          "Removing reachable cobwebs",
          "Final handover-style clean",
        ],
        notIncluded: [
          "Removing rubble or construction dust",
          "Painting or repairs",
          "Pest control",
          "Heavy stain removal",
          "Removing abandoned furniture",
          "Transporting waste",
          "Cleaning occupied cupboards full of belongings",
        ],
        defaultHours: 8,
        priceHintMin: 700,
        priceHintMax: 1200,
      },
      {
        id: "garage",
        label: "Garage & outside cleaning",
        tabLabel: "Garage & outside",
        description:
          "Light cleaning of garage, verandah, patio, paved yard, driveway, and outside areas.",
        included: [
          "Sweeping garage floor",
          "Sweeping verandah or patio",
          "Sweeping driveway or paved yard",
          "Removing reachable cobwebs",
          "Dusting or wiping garage surfaces",
          "Neatly arranging light items",
          "Emptying light rubbish into your bins",
          "Cleaning outside sink area, if applicable",
        ],
        notIncluded: [
          "Gardening or lawn mowing",
          "Tree cutting or landscaping",
          "Heavy rubbish or rubble removal",
          "Washing cars",
          "Pressure washing (unless offered later)",
          "Moving heavy boxes or furniture",
          "Cleaning septic or drainage areas",
          "Full inside house cleaning",
        ],
        defaultHours: 3,
        priceHintMin: 250,
        priceHintMax: 400,
      },
      {
        id: "guest_checkout",
        label: "Guest checkout clean",
        tabLabel: "Guest checkout clean",
        description:
          "Cleaning an Airbnb, guesthouse room, or short-stay unit after a guest checks out and before the next guest arrives.",
        pricingHint:
          "Price depends on unit size, bedrooms and bathrooms, linen requirements, checkout condition, and whether restocking or photo reporting is needed.",
        included: [
          "Bathroom cleaning",
          "Kitchen surface cleaning",
          "Floor sweeping and mopping",
          "Bed setup with clean linen",
          "Used linen removal",
          "Bin emptying",
          "Mirror cleaning",
          "Light dusting",
          "Forgotten item check",
          "Damage or missing item reporting",
        ],
        notIncluded: [
          "Laundry washing",
          "Deep cleaning",
          "Buying supplies",
          "Repairs or maintenance",
          "Pest control",
          "Excessive mess or party cleanup",
          "Outdoor or shared area cleaning",
        ],
        defaultHours: 4,
        priceHintMin: 400,
        priceHintMax: 650,
      },
      {
        id: "same_day_turnaround",
        label: "Same-day turnaround",
        tabLabel: "Same-day turnaround",
        description:
          "Fast Airbnb cleaning for back-to-back bookings where one guest checks out and another checks in on the same day.",
        pricingHint:
          "Same-day turnaround costs more than normal guest checkout cleaning because it is urgent and time-sensitive.",
        included: [
          "Fast checkout clean",
          "Bed and linen setup",
          "Bathroom refresh",
          "Kitchen refresh",
          "Floor cleaning",
          "Bin emptying",
          "Readiness check",
          "Urgent issue reporting",
        ],
        notIncluded: [
          "Deep cleaning",
          "Laundry washing unless selected",
          "Repairs",
          "Shopping or restocking",
          "Guest waiting",
          "Excessive mess cleanup",
          "Key handover unless selected",
        ],
        defaultHours: 4,
        priceHintMin: 500,
        priceHintMax: 750,
      },
      {
        id: "deep_airbnb",
        label: "Deep Airbnb clean",
        tabLabel: "Deep Airbnb clean",
        description:
          "A more detailed clean after multiple guest stays, long bookings, heavy use, or before improving the guest experience.",
        pricingHint:
          "Price depends on unit size, bedrooms and bathrooms, condition of the unit, and extras such as fridge, oven, microwave, windows, or laundry.",
        included: [
          "Detailed bathroom cleaning",
          "Detailed kitchen cleaning",
          "Tile and corner cleaning",
          "Door, handle, and switch wiping",
          "Skirting board dusting",
          "Under-bed reachable cleaning",
          "Mirror and glass cleaning",
          "Cobweb removal",
          "Damage and stain reporting",
        ],
        notIncluded: [
          "Carpet machine cleaning",
          "Upholstery cleaning",
          "Pest control",
          "Repairs",
          "Painting",
          "Laundry unless selected",
          "Post-construction cleaning",
        ],
        defaultHours: 6,
        priceHintMin: 550,
        priceHintMax: 900,
      },
      {
        id: "linen_setup",
        label: "Linen change & setup",
        tabLabel: "Linen change & setup",
        description:
          "Linen changed, beds prepared, towels replaced, and the unit quickly set up for the next guest.",
        pricingHint:
          "Price depends on number of beds, bedrooms, towel setup, and whether laundry or ironing is included.",
        included: [
          "Remove used linen",
          "Remove used towels",
          "Make beds",
          "Place clean towels",
          "Arrange pillows",
          "Check visible linen condition",
          "Report missing or damaged linen",
          "Light bedroom setup",
        ],
        notIncluded: [
          "Full unit cleaning",
          "Bathroom cleaning",
          "Kitchen cleaning",
          "Laundry washing",
          "Ironing",
          "Buying linen",
          "Deep mattress cleaning",
        ],
        defaultHours: 3,
        priceHintMin: 250,
        priceHintMax: 450,
      },
    ],
    addons: [
      {
        id: "laundry",
        label: "Laundry",
        description: "Wash, dry, and fold",
        priceHint: 80,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "ironing",
        label: "Ironing",
        description: "Press clothes and linen",
        priceHint: 80,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "dishes",
        label: "Dish washing",
        description: "Wash and tidy dishes in the sink",
        priceHint: 50,
        allowedTypes: ["standard", "apartment", ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "oven",
        label: "Inside oven",
        description: "Degrease and scrub oven interior",
        priceHint: 100,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "fridge",
        label: "Inside fridge",
        description: "Clean shelves and interior",
        priceHint: 80,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "windows",
        label: "Interior windows",
        description: "Glass and frames inside",
        priceHint: 100,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "cabinets",
        label: "Inside cupboards",
        description: "Kitchen cupboards emptied first",
        priceHint: 100,
        allowedTypes: ["standard", "spring", "apartment", ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "bedding",
        label: "Bedding change",
        description: "Change bed linen you provide on site",
        priceHint: 60,
        allowedTypes: ["standard", "spring", "apartment", ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "balcony",
        label: "Balcony or verandah",
        description: "Sweep and tidy balcony, patio, or verandah",
        priceHint: 60,
        allowedTypes: ["standard", "spring", "apartment", ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "supplies",
        label: "Cleaning supplies",
        description: "Helper brings basic cleaning supplies",
        priceHint: 80,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, ...AIRBNB_ADDON_TYPES],
      },
      {
        id: "appliances",
        label: "Clean appliances",
        description: "Microwave, kettle, toaster, and coffee machine",
        priceHint: 80,
        allowedTypes: [...AIRBNB_ADDON_TYPES],
      },
      {
        id: "restock_supplies",
        label: "Restock supplies",
        description: "Kitchen consumables you keep on site",
        priceHint: 50,
        allowedTypes: [...AIRBNB_ADDON_TYPES],
      },
      {
        id: "restock_toiletries",
        label: "Restock toiletries",
        description: "Soap, shampoo, and bathroom essentials on site",
        priceHint: 50,
        allowedTypes: [...AIRBNB_ADDON_TYPES],
      },
      {
        id: "photo_report",
        label: "Photo report",
        description: "Completion photos sent after the clean",
        priceHint: 40,
        allowedTypes: [...AIRBNB_ADDON_TYPES],
      },
      {
        id: "damage_report",
        label: "Damage report",
        description: "Detailed report of visible damages or missing items",
        priceHint: 40,
        allowedTypes: [...AIRBNB_ADDON_TYPES],
      },
      {
        id: "extra_bedroom",
        label: "Extra bedroom",
        description: "Additional bedroom beyond the base quote",
        priceHint: 80,
        allowedTypes: [...AIRBNB_ADDON_TYPES],
      },
      {
        id: "extra_bathroom",
        label: "Extra bathroom",
        description: "Additional bathroom beyond the base quote",
        priceHint: 60,
        allowedTypes: [...AIRBNB_ADDON_TYPES],
      },
      {
        id: "key_handover",
        label: "Key pickup or drop-off",
        description: "Helper collects or returns keys",
        priceHint: 60,
        allowedTypes: [...AIRBNB_ADDON_TYPES],
      },
    ],
  },
  nanny: {
    key: "nanny",
    title: "Nannies & childcare",
    tagline: "Verified childcare for day help, babysitting, infant care, and after-school support",
    bookParam: "nanny",
    scopeLabel: "children",
    types: [
      {
        id: "day_nanny",
        label: "Day nanny",
        tabLabel: "Day nanny",
        description:
          "For parents or guardians who need childcare support during the day while they are at work, running errands, or busy at home.",
        pricingHint:
          "Price depends on the number of children, their ages, duration of care, and whether extras such as bathing, meal prep, or homework help are required.",
        included: [
          "Child supervision",
          "Feeding and snack support",
          "Simple child meal preparation",
          "Playtime and routine support",
          "Nap support",
          "Child-related tidying",
          "Bottle or child dish washing",
        ],
        notIncluded: [
          "Full house cleaning",
          "Household laundry",
          "Cooking for the whole family",
          "Overnight care",
          "School transport",
          "Medical care",
          "Caring for additional children not listed in the booking",
        ],
        defaultHours: 6,
        priceHintMin: 300,
        priceHintMax: 500,
      },
      {
        id: "babysitter",
        label: "Babysitter",
        tabLabel: "Babysitter",
        description:
          "Short childcare bookings when parents need help for a few hours, such as errands, appointments, date nights, events, or temporary supervision.",
        pricingHint:
          "Price depends on the number of hours, number of children, their ages, and whether the booking is during the evening, weekend, or public holiday.",
        included: [
          "Short-term child supervision",
          "Safe indoor play",
          "Snacks or meals provided by parent",
          "Bedtime support if requested",
          "Light child-related tidying",
        ],
        notIncluded: [
          "House cleaning",
          "Full meal cooking",
          "School pickup",
          "Overnight care",
          "Medical care",
          "Caring for extra children not declared",
        ],
        defaultHours: 4,
        priceHintMin: 200,
        priceHintMax: 350,
      },
      {
        id: "infant_care",
        label: "Infant care",
        tabLabel: "Infant care",
        description:
          "Support caring for babies and very young children who require more attention, feeding support, nappies, naps, and careful supervision.",
        pricingHint:
          "Infant care is priced higher than normal babysitting because it requires closer attention, more responsibility, and more hands-on care.",
        included: [
          "Infant supervision",
          "Feeding support",
          "Bottle preparation",
          "Burping",
          "Nappy changing",
          "Nap support",
          "Baby-related tidying",
          "Cleaning bottles used during the booking",
        ],
        notIncluded: [
          "Medical care",
          "Sleep training",
          "Full house cleaning",
          "Family laundry",
          "Overnight care",
          "Caring for sick babies without prior notice",
        ],
        defaultHours: 4,
        priceHintMin: 300,
        priceHintMax: 450,
      },
      {
        id: "after_school",
        label: "After-school care",
        tabLabel: "After-school care",
        description:
          "Support with children after school, including supervision, snacks, routines, homework support, and keeping the child safe until the parent is available.",
        pricingHint:
          "Price depends on the number of children, duration, whether homework support is needed, and whether the booking repeats on weekdays.",
        included: [
          "After-school supervision",
          "Snack support",
          "Routine support",
          "Basic homework supervision",
          "Safe indoor play or reading",
          "Child-related tidying",
        ],
        notIncluded: [
          "Formal tutoring",
          "School transport",
          "Full meal cooking",
          "House cleaning",
          "Laundry",
          "Overnight care",
        ],
        defaultHours: 4,
        priceHintMin: 250,
        priceHintMax: 400,
      },
      {
        id: "weekend_nanny",
        label: "Weekend nanny",
        tabLabel: "Weekend nanny",
        description:
          "Childcare support over the weekend, whether for errands, events, work commitments, rest, or family support.",
        pricingHint:
          "Weekend bookings may cost more than weekday bookings depending on demand, duration, number of children, and whether the booking is late evening or public holiday.",
        included: [
          "Weekend child supervision",
          "Feeding and snack support",
          "Playtime",
          "Nap support",
          "Child-related tidying",
          "Bathing if selected",
        ],
        notIncluded: [
          "Full house cleaning",
          "Family cooking",
          "Laundry",
          "Overnight care",
          "Transport",
          "Extra children not declared",
        ],
        defaultHours: 6,
        priceHintMin: 300,
        priceHintMax: 500,
      },
    ],
    addons: [
      {
        id: "bathing",
        label: "Bathing support",
        description: "Bathe the child during the visit",
        priceHint: 50,
      },
      {
        id: "homework",
        label: "Homework supervision",
        description: "Focused homework support",
        priceHint: 60,
      },
      {
        id: "meal_prep",
        label: "Simple child meal preparation",
        description: "Prepare children's meals or snacks",
        priceHint: 60,
      },
      {
        id: "extra_child",
        label: "Extra child",
        description: "Care for an additional child beyond the first",
        priceHint: 80,
      },
      {
        id: "evening",
        label: "Evening booking",
        description: "Care during evening hours",
        priceHint: 60,
      },
      {
        id: "public_holiday",
        label: "Public holiday booking",
        description: "Care on a public holiday",
        priceHint: 80,
      },
      {
        id: "baby_care",
        label: "Baby care",
        description: "Extra hands-on baby care support",
        priceHint: 70,
      },
      {
        id: "bottle_washing",
        label: "Bottle washing",
        description: "Wash bottles and child feeding items",
        priceHint: 40,
      },
      {
        id: "child_laundry",
        label: "Child laundry",
        description: "Wash or tidy child clothing",
        priceHint: 60,
      },
    ],
  },
};

export function categorySlugToKey(slug: string): ServiceCategoryKey | null {
  if (slug.includes("nanny")) return "nanny";
  if (slug.includes("clean") || slug.includes("house")) return "cleaning";
  return null;
}

export function paramToCategoryKey(param: string | null): ServiceCategoryKey | null {
  if (param === "nanny") return "nanny";
  if (param === "cleaning" || param === "house-cleaner") return "cleaning";
  return null;
}

export function defaultServiceDetails(category: ServiceCategoryKey): ServiceDetails {
  const entry = SERVICE_CATALOG[category];
  const firstType = entry.types[0];
  if (category === "cleaning") {
    return {
      category,
      serviceType: firstType.id,
      durationHours: firstType.defaultHours,
      bedrooms: 3,
      bathrooms: 2,
      addons: [],
      frequency: "once",
    };
  }
  return {
    category,
    serviceType: firstType.id,
    durationHours: firstType.defaultHours,
    children: 1,
    childAgeGroups: [],
    addons: [],
    frequency: "once",
  };
}

export function getLinenPreferences(details: ServiceDetails): LinenPreference[] {
  if (details.linenPreferences?.length) return details.linenPreferences;
  if (details.linenPreference) return [details.linenPreference];
  return ["replace_no_wash"];
}

export function defaultBetweenGuestServiceDetails(): ServiceDetails {
  const typeId = AIRBNB_CLEANING_TYPE_IDS[0];
  const type = getServiceType("cleaning", typeId);
  return {
    category: "cleaning",
    serviceType: typeId,
    durationHours: type?.defaultHours ?? 4,
    bedrooms: 2,
    bathrooms: 1,
    addons: [],
    frequency: "once",
    linenPreferences: ["replace_no_wash"],
  };
}

export function getServiceType(category: ServiceCategoryKey, typeId: string) {
  const normalized = normalizeServiceType(category, typeId);
  return SERVICE_CATALOG[category].types.find((t) => t.id === normalized);
}

export function getAddon(category: ServiceCategoryKey, addonId: string) {
  return SERVICE_CATALOG[category].addons.find((a) => a.id === addonId);
}

export function getAvailableAddons(category: ServiceCategoryKey, serviceType: string) {
  return SERVICE_CATALOG[category].addons.filter(
    (addon) => !addon.allowedTypes || addon.allowedTypes.includes(serviceType)
  );
}

export function sanitizeAddons(
  category: ServiceCategoryKey,
  serviceType: string,
  addons: string[]
) {
  const valid = new Set(getAvailableAddons(category, serviceType).map((addon) => addon.id));
  return addons.filter((id) => valid.has(id));
}

/** Flat list for booking entry (category inferred from service type). */
export function catalogServiceTypeOptions() {
  const order: ServiceCategoryKey[] = ["nanny", "cleaning"];
  return order.flatMap((categoryKey) => {
    const entry = SERVICE_CATALOG[categoryKey];
    const types =
      categoryKey === "cleaning"
        ? entry.types.filter((t) => !isAirbnbCleaningType(t.id))
        : entry.types;
    return types.map((type) => ({
      categoryKey,
      categoryTitle: entry.title,
      type,
    }));
  });
}

export function categoryKeyToDbSlug(categoryKey: ServiceCategoryKey) {
  return categoryKey === "nanny" ? "nanny-services" : "house-cleaning";
}
