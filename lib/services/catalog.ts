import { HANDYMAN_ADDONS, HANDYMAN_TYPE_IDS, HANDYMAN_TYPES } from "./handyman-types";
import type {
  PartsAvailable,
  PlumberBuyParts,
  PlumbingBookingMode,
  PlumbingWorkerRouteType,
} from "./handyman-plumbing";

export type ServiceCategoryKey =
  | "cleaning"
  | "nanny"
  | "housekeeping"
  | "cooking"
  | "laundry"
  | "garden"
  | "handyman";

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
  /** Short copy on service selection (no full checklist). */
  selectionSummary?: string;
  priceDrivers?: string[];
  prepareBeforeVisit?: string[];
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
  scopeLabel: "home" | "children" | "yard" | "laundry_load";
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
  /** Handyman plumbing: customer-selected issue type */
  plumbingJobType?: string;
  /** Handyman plumbing: resolved booking path */
  handymanBookingMode?: PlumbingBookingMode;
  /** Handyman plumbing: backend worker routing */
  routeToWorkerType?: PlumbingWorkerRouteType;
  partsAvailable?: PartsAvailable;
  plumberBuyParts?: PlumberBuyParts;
  activeLeak?: boolean;
  waterShutoffAvailable?: boolean;
  requiresAdminReview?: boolean;
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

export const LAUNDRY_TYPE_IDS = [
  "wash_fold",
  "ironing",
  "bedding_laundry",
  "curtain_laundry",
  "pickup_dropoff",
] as const;

export const GARDEN_TYPE_IDS = [
  "lawn_cutting",
  "yard_sweeping",
  "hedge_trimming",
  "garden_cleanup",
  "watering_plants",
] as const;

export const HOUSEKEEPING_TYPE_IDS = [
  "half_day",
  "full_day",
  "weekly",
  "monthly",
] as const;

export const COOKING_TYPE_IDS = [
  "lunch",
  "dinner",
  "meal_prep",
  "weekly_cooking",
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

export function getLaundryTypes(): ServiceTypeOption[] {
  const byId = new Map(SERVICE_CATALOG.laundry.types.map((t) => [t.id, t] as const));
  return LAUNDRY_TYPE_IDS.map((id) => byId.get(id)).filter(
    (t): t is ServiceTypeOption => t !== undefined
  );
}

export function getGardenTypes(): ServiceTypeOption[] {
  const byId = new Map(SERVICE_CATALOG.garden.types.map((t) => [t.id, t] as const));
  return GARDEN_TYPE_IDS.map((id) => byId.get(id)).filter(
    (t): t is ServiceTypeOption => t !== undefined
  );
}

export function getHousekeepingTypes(): ServiceTypeOption[] {
  const byId = new Map(SERVICE_CATALOG.housekeeping.types.map((t) => [t.id, t] as const));
  return HOUSEKEEPING_TYPE_IDS.map((id) => byId.get(id)).filter(
    (t): t is ServiceTypeOption => t !== undefined
  );
}

export function getCookingTypes(): ServiceTypeOption[] {
  const byId = new Map(SERVICE_CATALOG.cooking.types.map((t) => [t.id, t] as const));
  return COOKING_TYPE_IDS.map((id) => byId.get(id)).filter(
    (t): t is ServiceTypeOption => t !== undefined
  );
}

export function getHandymanTypes(): ServiceTypeOption[] {
  const byId = new Map(SERVICE_CATALOG.handyman.types.map((t) => [t.id, t] as const));
  return HANDYMAN_TYPE_IDS.map((id) => byId.get(id)).filter(
    (t): t is ServiceTypeOption => t !== undefined
  );
}

export function isRecurringHousekeepingType(serviceType: string): boolean {
  return serviceType === "weekly" || serviceType === "monthly";
}

export function isRecurringCookingType(serviceType: string): boolean {
  return serviceType === "weekly_cooking";
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
          "For general home cleaning, including bedrooms, bathrooms, kitchen, and living areas.",
        selectionSummary:
          "Includes basic cleaning of common home areas. Extras like oven, fridge, laundry, or deep cleaning can be added later.",
        priceDrivers: [
          "Number of bedrooms and bathrooms",
          "Type of cleaning selected",
          "Extra tasks added",
          "Length of visit",
          "Your area in Lusaka",
        ],
        prepareBeforeVisit: [
          "Please make sure cleaning supplies are available",
          "Keep valuables safely stored",
          "Let us know about pets, parking, or access instructions",
        ],
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
        label: "Deep short-stay clean",
        tabLabel: "Deep short-stay clean",
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
  housekeeping: {
    key: "housekeeping",
    title: "Housekeeping",
    tagline:
      "Book household help by the visit: cleaning, laundry, dishes, and tidying for a set time",
    bookParam: "housekeeping",
    scopeLabel: "home",
    types: [
      {
        id: "half_day",
        label: "Half-day help",
        tabLabel: "Half-day",
        description:
          "Up to four hours of household help at your home. You choose the duties: cleaning, laundry, dishes, tidying, and more.",
        pricingHint:
          "Price depends on visit length, duties selected, and whether this is a one-off or recurring booking.",
        included: [
          "Up to 4 hours at your home",
          "Your chosen household duties",
          "Flexible task list for the visit",
          "General tidying and organising",
          "Kitchen and bathroom upkeep as needed",
        ],
        notIncluded: [
          "Deep move-out or post-construction cleaning",
          "Dedicated childcare (book nannies separately)",
          "Garden landscaping or lawn mowing",
          "Buying groceries or supplies unless agreed",
          "Heavy lifting or furniture moving",
        ],
        defaultHours: 4,
        priceHintMin: 250,
        priceHintMax: 400,
      },
      {
        id: "full_day",
        label: "Full-day help",
        tabLabel: "Full-day",
        description:
          "A full day of household support, up to eight hours for cleaning, laundry, meal prep, and keeping the home running.",
        pricingHint:
          "Full-day visits cost more than half-day help because of the longer time block and broader duties.",
        included: [
          "Up to 8 hours at your home",
          "Multiple household duties in one visit",
          "Cleaning, laundry, dishes, and tidying",
          "Meal prep or ironing if selected",
          "Flexible priorities you set on the day",
        ],
        notIncluded: [
          "Live-in or overnight care",
          "Childcare unless booked as nanny service",
          "Major garden or outside landscaping",
          "Repairs, painting, or maintenance",
          "Running errands by car unless agreed",
        ],
        defaultHours: 8,
        priceHintMin: 450,
        priceHintMax: 700,
      },
      {
        id: "weekly",
        label: "Weekly housekeeping",
        tabLabel: "Weekly",
        description:
          "The same helper on a weekly schedule: regular cleaning, laundry, dishes, and household upkeep.",
        pricingHint:
          "Weekly housekeeping is priced per visit. Duties and visit length shape the guide price.",
        included: [
          "Recurring weekly visit",
          "Your chosen household duties each week",
          "Consistent help for busy families",
          "Cleaning, laundry, and tidying as needed",
          "Same-day priorities you can adjust",
        ],
        notIncluded: [
          "Live-in domestic work",
          "Dedicated full-time placement",
          "Deep spring cleans every visit (book cleaning separately)",
          "Garden landscaping",
          "Childcare",
        ],
        defaultHours: 4,
        priceHintMin: 220,
        priceHintMax: 380,
      },
      {
        id: "monthly",
        label: "Monthly housekeeping",
        tabLabel: "Monthly",
        description:
          "A longer monthly visit for households that want a thorough reset: cleaning, laundry, bedding, and organisation.",
        pricingHint:
          "Monthly visits are typically longer. Price depends on home size, duties, and how much needs doing.",
        included: [
          "Scheduled monthly visit",
          "Broader household duties in one session",
          "Deep tidying and organisation time",
          "Laundry, bedding, and kitchen catch-up",
          "Flexible task list for the day",
        ],
        notIncluded: [
          "Weekly or daily live-in help",
          "Move-in/move-out deep cleaning",
          "Major garden work",
          "Childcare",
          "Buying supplies unless agreed",
        ],
        defaultHours: 8,
        priceHintMin: 500,
        priceHintMax: 800,
      },
    ],
    addons: [
      {
        id: "cleaning",
        label: "General cleaning",
        description: "Sweeping, mopping, dusting, and bathroom refresh",
        priceHint: 0,
      },
      {
        id: "dishes",
        label: "Washing dishes",
        description: "Wash, dry, and tidy kitchen dishes",
        priceHint: 0,
      },
      {
        id: "laundry",
        label: "Laundry",
        description: "Wash, fold, and organise household laundry",
        priceHint: 40,
      },
      {
        id: "ironing",
        label: "Ironing",
        description: "Iron clothes, uniforms, and household linen",
        priceHint: 50,
      },
      {
        id: "bedding",
        label: "Bedding & linen",
        description: "Change beds, refresh towels, and tidy linen cupboards",
        priceHint: 40,
      },
      {
        id: "meal_prep",
        label: "Simple meal prep",
        description: "Basic cooking or meal preparation for the household",
        priceHint: 60,
      },
      {
        id: "tidying",
        label: "Tidying & organising",
        description: "Organise visible clutter, cupboards, and living areas",
        priceHint: 0,
      },
      {
        id: "outside_sweep",
        label: "Outside sweep",
        description: "Sweep verandah, patio, or paved outside areas",
        priceHint: 40,
      },
    ],
  },
  cooking: {
    key: "cooking",
    title: "Cooking & meals",
    tagline: "Lunch, dinner, meal prep, and regular home cooking for Lusaka households",
    bookParam: "cooking",
    scopeLabel: "home",
    types: [
      {
        id: "lunch",
        label: "Lunch cooking",
        tabLabel: "Lunch",
        description:
          "A cook comes to prepare lunch for your household using ingredients you provide on site.",
        pricingHint:
          "Price depends on number of people, dishes requested, and whether kitchen cleanup is included.",
        included: [
          "Cooking lunch using your ingredients",
          "Basic kitchen cleanup after cooking",
          "Serving and clearing if selected",
          "Up to about 3 hours at your home",
        ],
        notIncluded: [
          "Buying groceries unless agreed upfront",
          "Catering for large events",
          "Dedicated childcare",
          "Deep kitchen cleaning beyond normal tidy-up",
        ],
        defaultHours: 3,
        priceHintMin: 200,
        priceHintMax: 350,
      },
      {
        id: "dinner",
        label: "Dinner cooking",
        tabLabel: "Dinner",
        description:
          "A cook prepares dinner for your family or guests using ingredients you provide.",
        pricingHint:
          "Price depends on headcount, number of dishes, dietary needs, and visit length.",
        included: [
          "Cooking dinner using your ingredients",
          "Basic kitchen cleanup after cooking",
          "Serving and clearing if selected",
          "Up to about 4 hours at your home",
        ],
        notIncluded: [
          "Buying groceries unless agreed upfront",
          "Wait staff for large events",
          "Baking-only bookings unless selected",
          "Washing dishes beyond the cooking area unless selected",
        ],
        defaultHours: 4,
        priceHintMin: 220,
        priceHintMax: 400,
      },
      {
        id: "meal_prep",
        label: "Meal prep",
        tabLabel: "Meal prep",
        description:
          "Batch cooking and portioning meals for the week ahead using ingredients you provide.",
        pricingHint:
          "Price depends on number of meals, containers needed, and dietary requirements.",
        included: [
          "Batch cooking multiple meals",
          "Portioning and labelling containers",
          "Basic kitchen cleanup",
          "Up to about 4 hours at your home",
        ],
        notIncluded: [
          "Buying ingredients unless agreed",
          "Delivery of meals off-site",
          "Specialised diet planning by a nutritionist",
          "Cleaning the whole kitchen beyond cooking area",
        ],
        defaultHours: 4,
        priceHintMin: 250,
        priceHintMax: 420,
      },
      {
        id: "weekly_cooking",
        label: "Weekly cooking",
        tabLabel: "Weekly",
        description:
          "The same cook on a weekly schedule for regular lunch or dinner support.",
        pricingHint:
          "Weekly cooking is priced per visit. Headcount and dishes shape the guide price.",
        included: [
          "Recurring weekly cooking visit",
          "Your chosen meals each week",
          "Consistent help for busy households",
          "Kitchen cleanup after cooking",
          "Flexible menu priorities you can adjust",
        ],
        notIncluded: [
          "Live-in cook placement",
          "Buying groceries every week unless agreed",
          "Large party catering",
          "Full housekeeping beyond the kitchen",
        ],
        defaultHours: 4,
        priceHintMin: 230,
        priceHintMax: 400,
      },
    ],
    addons: [
      {
        id: "local_dishes",
        label: "Local dishes",
        description: "Nshima, relish, and everyday Zambian home meals",
        priceHint: 0,
      },
      {
        id: "serve_clear",
        label: "Serve & clear",
        description: "Serve food and clear the table after the meal",
        priceHint: 0,
      },
      {
        id: "kitchen_cleanup",
        label: "Kitchen cleanup",
        description: "Wash pots, wipe surfaces, and tidy the cooking area",
        priceHint: 0,
      },
      {
        id: "packed_lunch",
        label: "Packed lunch",
        description: "Portion meals for school or work lunchboxes",
        priceHint: 40,
      },
      {
        id: "baking",
        label: "Baking",
        description: "Bread, cakes, or other baked items",
        priceHint: 50,
      },
      {
        id: "dietary_care",
        label: "Dietary care",
        description: "Low salt, diabetic-friendly, or allergy-aware cooking",
        priceHint: 40,
      },
    ],
  },
  laundry: {
    key: "laundry",
    title: "Laundry & ironing",
    tagline: "Washing, folding, bedding, curtains, and ironing support for Lusaka homes",
    bookParam: "laundry",
    scopeLabel: "laundry_load",
    types: [
      {
        id: "wash_fold",
        label: "Wash & fold",
        tabLabel: "Wash & fold",
        description:
          "Help washing, drying, folding, and organising everyday clothing and household linen you provide.",
        pricingHint:
          "Price depends on load size, whether you need drying or folding only, and whether bedding or towels are included.",
        included: [
          "Sorting laundry you provide",
          "Washing clothes and household linen",
          "Drying where facilities allow",
          "Folding and neat stacking",
          "Basic laundry area tidy-up",
        ],
        notIncluded: [
          "Buying detergent or supplies unless agreed",
          "Dry cleaning",
          "Repairs or stain treatment beyond normal washing",
          "Ironing unless selected",
          "Pickup and drop-off unless selected",
        ],
        defaultHours: 4,
        priceHintMin: 200,
        priceHintMax: 400,
      },
      {
        id: "ironing",
        label: "Ironing",
        tabLabel: "Ironing",
        description:
          "Pressing and folding clothes, uniforms, and household linen you have already washed or had cleaned.",
        pricingHint:
          "Price depends on the number of items, type of clothing, and whether school uniforms or work shirts are included.",
        included: [
          "Ironing clothes you provide",
          "Folding pressed items",
          "Hanging or stacking finished laundry",
          "Light laundry-area tidy-up",
        ],
        notIncluded: [
          "Washing unless selected",
          "Dry cleaning",
          "Alterations or repairs",
          "Pickup and drop-off unless selected",
        ],
        defaultHours: 3,
        priceHintMin: 180,
        priceHintMax: 350,
      },
      {
        id: "bedding_laundry",
        label: "Bedding laundry",
        tabLabel: "Bedding laundry",
        description:
          "Washing, drying, and remaking beds with bedding and towels you provide on site.",
        pricingHint:
          "Price depends on the number of beds, amount of bedding and towels, and whether ironing is needed.",
        included: [
          "Stripping used bedding",
          "Washing bedding and towels",
          "Drying where facilities allow",
          "Remaking beds",
          "Folding spare linen",
        ],
        notIncluded: [
          "Mattress deep cleaning",
          "Buying bedding or towels",
          "Curtain laundry unless selected",
          "Ironing unless selected",
        ],
        defaultHours: 4,
        priceHintMin: 220,
        priceHintMax: 420,
      },
      {
        id: "curtain_laundry",
        label: "Curtain laundry",
        tabLabel: "Curtain laundry",
        description:
          "Help taking down, washing, drying, and rehanging curtains or drapes you provide.",
        pricingHint:
          "Price depends on the number of curtains, fabric type, height, and whether ironing or pressing is needed.",
        included: [
          "Taking down curtains where reachable",
          "Washing curtains you provide",
          "Drying where facilities allow",
          "Rehanging curtains",
          "Light tidying of affected rooms",
        ],
        notIncluded: [
          "Dry cleaning",
          "High ladders or risky height work",
          "Curtain repairs or alterations",
          "Buying new curtains",
        ],
        defaultHours: 4,
        priceHintMin: 250,
        priceHintMax: 450,
      },
      {
        id: "pickup_dropoff",
        label: "Pickup & drop-off",
        tabLabel: "Pickup & drop-off",
        description:
          "Collect laundry from your home, coordinate washing and return, or drop off at your chosen laundry point.",
        pricingHint:
          "Price depends on load size, distance within Lusaka, turnaround time, and whether washing or ironing is included.",
        included: [
          "Collecting laundry from your home",
          "Returning cleaned laundry",
          "Basic sorting and bagging",
          "Status updates during the booking window",
        ],
        notIncluded: [
          "Third-party laundry shop fees unless agreed upfront",
          "Dry cleaning",
          "Express same-hour turnaround unless agreed",
          "Washing at your home unless selected",
        ],
        defaultHours: 3,
        priceHintMin: 200,
        priceHintMax: 400,
      },
    ],
    addons: [
      {
        id: "ironing_addon",
        label: "Ironing add-on",
        description: "Press clothes after washing",
        priceHint: 60,
      },
      {
        id: "express_turnaround",
        label: "Same-day turnaround",
        description: "Priority return within the same day",
        priceHint: 80,
      },
      {
        id: "delicate_care",
        label: "Delicate care",
        description: "Hand-wash or gentle care for delicate items",
        priceHint: 50,
      },
    ],
  },
  garden: {
    key: "garden",
    title: "Garden & yard work",
    tagline: "Lawn, yard, verandah, and outside area help for Lusaka homes",
    bookParam: "garden",
    scopeLabel: "yard",
    types: [
      {
        id: "lawn_cutting",
        label: "Lawn cutting",
        tabLabel: "Lawn cutting",
        description:
          "Cutting grass and tidying lawns, paved edges, and reachable yard areas around your home.",
        pricingHint:
          "Price depends on lawn size, grass height, access, and whether clipping collection is needed.",
        included: [
          "Cutting reachable lawn areas",
          "Trimming lawn edges where possible",
          "Collecting clippings into bags or a pile",
          "Basic yard tidy after cutting",
        ],
        notIncluded: [
          "Tree cutting or large branch removal",
          "Landscaping or planting design",
          "Pest control",
          "Supplying fuel or equipment beyond basic tools",
        ],
        defaultHours: 3,
        priceHintMin: 200,
        priceHintMax: 400,
      },
      {
        id: "yard_sweeping",
        label: "Yard sweeping",
        tabLabel: "Yard sweeping",
        description:
          "Sweeping yards, verandahs, paved areas, and outside walkways to clear dust, leaves, and debris.",
        pricingHint:
          "Price depends on yard size, paved area coverage, and how much debris needs clearing.",
        included: [
          "Sweeping paved yards and verandahs",
          "Clearing visible leaves and debris",
          "Bagging or piling rubbish for disposal",
          "Light outside area tidy-up",
        ],
        notIncluded: [
          "Rubbish removal off-site",
          "Pressure washing",
          "Drain or septic cleaning",
          "Roof or gutter cleaning",
        ],
        defaultHours: 3,
        priceHintMin: 180,
        priceHintMax: 350,
      },
      {
        id: "hedge_trimming",
        label: "Hedge trimming",
        tabLabel: "Hedge trimming",
        description:
          "Trimming hedges, shrubs, and reachable boundary plants to keep your yard neat and manageable.",
        pricingHint:
          "Price depends on hedge length, height, thickness, and how much clipping removal is needed.",
        included: [
          "Trimming reachable hedges and shrubs",
          "Shaping visible plant lines",
          "Collecting clippings",
          "Basic tidy of trimmed areas",
        ],
        notIncluded: [
          "Tree felling",
          "Poison or chemical weed treatment",
          "High ladder work beyond safe reach",
          "Garden design or planting",
        ],
        defaultHours: 4,
        priceHintMin: 220,
        priceHintMax: 420,
      },
      {
        id: "garden_cleanup",
        label: "Garden clean-up",
        tabLabel: "Garden clean-up",
        description:
          "A fuller outside tidy-up including sweeping, weeding reachable beds, and clearing overgrowth in the yard.",
        pricingHint:
          "Price depends on yard size, level of overgrowth, and whether green waste needs bagging or removal.",
        included: [
          "Sweeping yards and outside areas",
          "Weeding reachable beds and borders",
          "Clearing light overgrowth",
          "Bagging garden waste",
          "General outside tidy-up",
        ],
        notIncluded: [
          "Heavy rubble or construction waste",
          "Tree cutting",
          "Pest or fumigation work",
          "Full landscaping projects",
        ],
        defaultHours: 4,
        priceHintMin: 250,
        priceHintMax: 450,
      },
      {
        id: "watering_plants",
        label: "Watering plants",
        tabLabel: "Watering plants",
        description:
          "Watering garden beds, pots, lawns, and plants according to your instructions while you are away or busy.",
        pricingHint:
          "Price depends on garden size, number of plants, water access, and visit frequency.",
        included: [
          "Watering plants and beds as instructed",
          "Checking visible plant condition",
          "Light pot and bed tidy where needed",
          "Reporting obvious issues",
        ],
        notIncluded: [
          "Planting new plants",
          "Fertiliser or chemical treatment",
          "Lawn cutting unless selected",
          "Pest control",
        ],
        defaultHours: 3,
        priceHintMin: 150,
        priceHintMax: 300,
      },
    ],
    addons: [
      {
        id: "green_waste_bags",
        label: "Green waste bagging",
        description: "Extra bagging and stacking of clippings or leaves",
        priceHint: 50,
      },
      {
        id: "verandah_sweep",
        label: "Verandah sweep",
        description: "Detailed sweep of verandahs and outside sitting areas",
        priceHint: 40,
      },
      {
        id: "outside_toilet",
        label: "Outside toilet area",
        description: "Basic tidy of outside toilet or wash area",
        priceHint: 60,
      },
    ],
  },
  handyman: {
    key: "handyman",
    title: "Handyman & Home Repairs",
    tagline:
      "Small repairs, mounting, plumbing, electrical help, painting, carpentry, and home maintenance for Lusaka homes",
    bookParam: "handyman",
    scopeLabel: "home",
    types: HANDYMAN_TYPES,
    addons: HANDYMAN_ADDONS,
  },
};

export function categorySlugToKey(slug: string): ServiceCategoryKey | null {
  if (slug.includes("nanny")) return "nanny";
  if (slug.includes("housekeep")) return "housekeeping";
  if (slug.includes("cook")) return "cooking";
  if (slug.includes("laundry")) return "laundry";
  if (slug.includes("garden")) return "garden";
  if (slug.includes("handyman") || slug.includes("repair")) return "handyman";
  if (slug.includes("clean") || slug.includes("house")) return "cleaning";
  return null;
}

export function paramToCategoryKey(param: string | null): ServiceCategoryKey | null {
  if (param === "nanny") return "nanny";
  if (param === "housekeeping") return "housekeeping";
  if (param === "cooking") return "cooking";
  if (param === "laundry") return "laundry";
  if (param === "garden") return "garden";
  if (param === "handyman") return "handyman";
  if (param === "cleaning" || param === "house-cleaner") return "cleaning";
  return null;
}

export function defaultServiceDetails(category: ServiceCategoryKey): ServiceDetails {
  const entry = SERVICE_CATALOG[category];
  const firstType = entry.types[0];
  if (category === "nanny") {
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
  if (category === "housekeeping") {
    const serviceType = firstType.id;
    return {
      category,
      serviceType,
      durationHours: firstType.defaultHours,
      addons: [],
      frequency: serviceType === "weekly" ? "weekly" : "once",
    };
  }
  if (category === "cooking") {
    const serviceType = firstType.id;
    return {
      category,
      serviceType,
      durationHours: firstType.defaultHours,
      addons: [],
      frequency: serviceType === "weekly_cooking" ? "weekly" : "once",
    };
  }
  if (category === "handyman") {
    return {
      category,
      serviceType: firstType.id,
      durationHours: firstType.defaultHours,
      addons: [],
      frequency: "once",
    };
  }
  return {
    category,
    serviceType: firstType.id,
    durationHours: firstType.defaultHours,
    bedrooms: category === "garden" ? 0 : 3,
    bathrooms: category === "garden" ? 0 : 2,
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
  const order: ServiceCategoryKey[] = [
    "nanny",
    "cleaning",
    "housekeeping",
    "cooking",
    "laundry",
    "garden",
    "handyman",
  ];
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
  if (categoryKey === "nanny") return "nanny-services";
  return "house-cleaning";
}
