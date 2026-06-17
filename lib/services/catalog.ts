export type ServiceCategoryKey = "cleaning" | "nanny";

export interface ServiceTypeOption {
  id: string;
  label: string;
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
}

export const CHILD_AGE_GROUPS = [
  { id: "0-2", label: "0–2 years (infant)" },
  { id: "3-5", label: "3–5 years (toddler)" },
  { id: "6-12", label: "6–12 years (school age)" },
  { id: "13+", label: "13+ (teen)" },
] as const;

export const DURATION_OPTIONS = [3, 4, 6, 8] as const;

export const SERVICE_CATALOG: Record<ServiceCategoryKey, ServiceCatalogEntry> = {
  cleaning: {
    key: "cleaning",
    title: "House cleaning",
    tagline: "Standard, deep, move-in/out, and between-guest cleans for Lusaka homes",
    bookParam: "cleaning",
    scopeLabel: "home",
    types: [
      {
        id: "standard",
        label: "Standard home clean",
        description: "Regular maintenance clean for occupied homes.",
        included: [
          "All bedrooms & living areas",
          "Bathrooms: sinks, toilets, surfaces",
          "Kitchen surfaces & appliances (exterior)",
          "Sweep, mop & vacuum floors",
          "Beds made & bins emptied",
        ],
        defaultHours: 4,
        priceHintMin: 350,
        priceHintMax: 550,
      },
      {
        id: "deep",
        label: "Deep clean",
        description: "Thorough top-to-bottom clean, ideal for first visits or seasonal refreshes.",
        included: [
          "Everything in a standard clean",
          "Detailed bathroom scrubbing",
          "Inside cupboards (if cleared)",
          "Skirting boards & hard-to-reach areas",
          "Extra attention to kitchen grease & grime",
        ],
        defaultHours: 6,
        priceHintMin: 500,
        priceHintMax: 800,
      },
      {
        id: "move",
        label: "Move-in / move-out",
        description: "Empty or nearly empty home: walls, cupboards, and all rooms.",
        included: [
          "Full deep clean of all rooms",
          "Inside empty cupboards & wardrobes",
          "Appliances inside & out (as agreed)",
          "Windows (interior)",
          "Ready for handover or new tenants",
        ],
        defaultHours: 8,
        priceHintMin: 700,
        priceHintMax: 1200,
      },
      {
        id: "airbnb",
        label: "Between-guest clean",
        description:
          "Cleaning between guest stays — for Airbnb and short-stay properties in Lusaka.",
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
      { id: "laundry", label: "Laundry", description: "Wash, dry & fold", priceHint: 80 },
      { id: "ironing", label: "Ironing", description: "Press clothes & linen", priceHint: 80 },
      { id: "oven", label: "Inside oven", description: "Degrease & scrub oven interior", priceHint: 100, allowedTypes: ['standard', 'deep', 'move', 'airbnb'] },
      { id: "fridge", label: "Inside fridge", description: "Clean shelves & interior", priceHint: 80, allowedTypes: ['standard', 'deep', 'move', 'airbnb'] },
      { id: "windows", label: "Interior windows", description: "Glass & frames inside", priceHint: 100, allowedTypes: ['standard', 'deep', 'move', 'airbnb'] },
      { id: "cabinets", label: "Inside cabinets", description: "Kitchen cabinets (emptied first)", priceHint: 100, allowedTypes: ['standard', 'deep', 'move', 'airbnb'] },
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
    };
  }
  return {
    category,
    serviceType: firstType.id,
    durationHours: firstType.defaultHours,
    children: 1,
    childAgeGroups: [],
    addons: [],
  };
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
  };
}

export function getServiceType(category: ServiceCategoryKey, typeId: string) {
  return SERVICE_CATALOG[category].types.find((t) => t.id === typeId);
}

export function getAddon(category: ServiceCategoryKey, addonId: string) {
  return SERVICE_CATALOG[category].addons.find((a) => a.id === addonId);
}

/** Flat list for booking entry (category inferred from service type). */
export function catalogServiceTypeOptions() {
  const order: ServiceCategoryKey[] = ["nanny", "cleaning"];
  return order.flatMap((categoryKey) => {
    const entry = SERVICE_CATALOG[categoryKey];
    return entry.types.map((type) => ({
      categoryKey,
      categoryTitle: entry.title,
      type,
    }));
  });
}

export function categoryKeyToDbSlug(categoryKey: ServiceCategoryKey) {
  return categoryKey === "nanny" ? "nanny-services" : "house-cleaning";
}
