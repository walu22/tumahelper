export type ServiceCategoryKey = "cleaning" | "nanny";

export interface ServiceTypeOption {
  id: string;
  label: string;
  /** Shorter label for horizontal service tabs on mobile */
  tabLabel?: string;
  description: string;
  included: string[];
  notIncluded?: string[];
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

export function getResidentialCleaningTypes(): ServiceTypeOption[] {
  const byId = new Map(
    SERVICE_CATALOG.cleaning.types
      .filter((t) => t.id !== "airbnb")
      .map((t) => [t.id, t] as const)
  );
  return RESIDENTIAL_CLEANING_TYPE_IDS.map((id) => byId.get(id)).filter(
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
        id: "airbnb",
        label: "Airbnb cleaning",
        description:
          "Cleaning between guest stays for Airbnb and short-stay properties in Lusaka.",
        included: [
          "All bedrooms & living areas",
          "Beds remade with linen left on site",
          "Bathroom cleaned & towels reset (if provided)",
          "Kitchen surfaces & dishes washed",
          "Floors vacuumed/mopped & bins emptied",
        ],
        notIncluded: [
          "Toiletries, snacks, or welcome packs",
          "Key exchange or guest messaging",
          "Restocking supplies (you provide items if needed)",
        ],
        defaultHours: 4,
        priceHintMin: 400,
        priceHintMax: 650,
      },
    ],
    addons: [
      {
        id: "laundry",
        label: "Laundry",
        description: "Wash, dry, and fold",
        priceHint: 80,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, "airbnb"],
      },
      {
        id: "ironing",
        label: "Ironing",
        description: "Press clothes and linen",
        priceHint: 80,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, "airbnb"],
      },
      {
        id: "dishes",
        label: "Dish washing",
        description: "Wash and tidy dishes in the sink",
        priceHint: 50,
        allowedTypes: ["standard", "apartment", "airbnb"],
      },
      {
        id: "oven",
        label: "Inside oven",
        description: "Degrease and scrub oven interior",
        priceHint: 100,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, "airbnb"],
      },
      {
        id: "fridge",
        label: "Inside fridge",
        description: "Clean shelves and interior",
        priceHint: 80,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, "airbnb"],
      },
      {
        id: "windows",
        label: "Interior windows",
        description: "Glass and frames inside",
        priceHint: 100,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, "airbnb"],
      },
      {
        id: "cabinets",
        label: "Inside cupboards",
        description: "Kitchen cupboards emptied first",
        priceHint: 100,
        allowedTypes: ["standard", "spring", "apartment", "airbnb"],
      },
      {
        id: "bedding",
        label: "Bedding change",
        description: "Change bed linen you provide on site",
        priceHint: 60,
        allowedTypes: ["standard", "spring", "apartment", "airbnb"],
      },
      {
        id: "balcony",
        label: "Balcony or verandah",
        description: "Sweep and tidy balcony, patio, or verandah",
        priceHint: 60,
        allowedTypes: ["standard", "spring", "apartment", "airbnb"],
      },
      {
        id: "supplies",
        label: "Cleaning supplies",
        description: "Helper brings basic cleaning supplies",
        priceHint: 80,
        allowedTypes: [...HOME_CLEAN_ADDON_TYPES, "airbnb"],
      },
      {
        id: "appliances",
        label: "Clean appliances",
        description: "Microwave, kettle, toaster, and coffee machine",
        priceHint: 80,
        allowedTypes: ["airbnb"],
      },
      {
        id: "restock_supplies",
        label: "Restock supplies",
        description: "Kitchen consumables you keep on site",
        priceHint: 50,
        allowedTypes: ["airbnb"],
      },
      {
        id: "restock_toiletries",
        label: "Restock toiletries",
        description: "Soap, shampoo, and bathroom essentials on site",
        priceHint: 50,
        allowedTypes: ["airbnb"],
      },
    ],
  },
  nanny: {
    key: "nanny",
    title: "Nannies & childcare",
    tagline: "Verified childcare for babysitting, after-school, or regular help",
    bookParam: "nanny",
    scopeLabel: "children",
    types: [
      {
        id: "babysitting",
        label: "Babysitting",
        description: "Date night, appointments, or occasional cover.",
        included: [
          "Active supervision & safety",
          "Age-appropriate play & activities",
          "Snacks & basic meals (as agreed)",
          "Bedtime routine (if within hours)",
          "Updates to parents as needed",
        ],
        defaultHours: 4,
        priceHintMin: 200,
        priceHintMax: 350,
      },
      {
        id: "after_school",
        label: "After-school care",
        description: "Pick-up window or afternoon supervision until parents return.",
        included: [
          "Supervision after school hours",
          "Homework support (basic)",
          "Safe play & downtime",
          "Light snack preparation",
          "Handover notes to parents",
        ],
        defaultHours: 4,
        priceHintMin: 250,
        priceHintMax: 400,
      },
      {
        id: "regular",
        label: "Regular part-time",
        description: "Scheduled recurring help with the same nanny and a consistent routine.",
        included: [
          "Consistent weekly schedule",
          "Childcare routine you agree on",
          "Meal & activity planning",
          "Builds trust before permanent hire",
          "Flexible hours per visit",
        ],
        defaultHours: 6,
        priceHintMin: 350,
        priceHintMax: 550,
      },
      {
        id: "newborn",
        label: "Newborn & infant care",
        description: "Experienced help with babies 0–12 months.",
        included: [
          "Feeding & nappy support",
          "Safe sleep practices",
          "Soothing & settling",
          "Light nursery tidying",
          "Parent guidance & handover",
        ],
        defaultHours: 4,
        priceHintMin: 300,
        priceHintMax: 450,
      },
    ],
    addons: [
      { id: "meal_prep", label: "Meal prep", description: "Prepare children's meals", priceHint: 60 },
      { id: "homework", label: "Homework help", description: "Focused school support", priceHint: 60 },
      { id: "light_tidying", label: "Light tidying", description: "Tidy play areas & kitchen", priceHint: 50 },
      { id: "school_pickup", label: "School pickup", description: "Collect children from school", priceHint: 80 },
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
  const type = getServiceType("cleaning", "airbnb");
  return {
    category: "cleaning",
    serviceType: "airbnb",
    durationHours: type?.defaultHours ?? 4,
    bedrooms: 2,
    bathrooms: 1,
    addons: [],
    frequency: "once",
    linenPreferences: ["replace_no_wash"],
  };
}

export function getServiceType(category: ServiceCategoryKey, typeId: string) {
  return SERVICE_CATALOG[category].types.find((t) => t.id === typeId);
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
        ? entry.types.filter((t) => t.id !== "airbnb")
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
