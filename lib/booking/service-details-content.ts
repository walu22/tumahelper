import {
  getServiceType,
  type ServiceCategoryKey,
  type ServiceTypeOption,
} from "@/lib/services/catalog";

export type ServiceDetailsVariant = "selection" | "plan" | "scope" | "confirm";

export const WHAT_HAPPENS_NEXT = [
  "We send your booking request to the helper",
  "You'll receive confirmation by SMS or WhatsApp",
  "You can contact support if your plans change",
  "Pay on Airtel Money after booking (upload proof in the app)",
] as const;

const CATEGORY_SELECTION_FALLBACK: Record<ServiceCategoryKey, string> = {
  cleaning:
    "Includes basic cleaning of common home areas. Extras like oven, fridge, laundry, or deep cleaning can be added later.",
  nanny:
    "Childcare during the visit you book. Extras like meal prep, homework help, or bathing can be added later.",
  housekeeping:
    "Regular household help during the visit. Duties and add-ons can be adjusted on the next step.",
  cooking:
    "Meal preparation for the visit you book. Serving, dishes, and extras can be added later.",
  laundry:
    "Laundry help for the visit you book. Ironing and delicate care can be added later.",
  garden:
    "Yard and garden work for the visit you book. Extra tasks can be added later.",
  handyman:
    "Minor repairs and maintenance for the visit you book. Parts, access, and job type affect the final price.",
};

const CATEGORY_PRICE_DRIVERS: Record<ServiceCategoryKey, string[]> = {
  cleaning: [
    "Number of bedrooms and bathrooms",
    "Type of cleaning selected",
    "Extra tasks added",
    "Length of visit",
    "Your area in Lusaka",
  ],
  nanny: [
    "Number and ages of children",
    "Type of care selected",
    "Visit length",
    "Extra tasks added",
    "Your area in Lusaka",
  ],
  housekeeping: [
    "Visit length and duties selected",
    "How often you book",
    "Extra tasks added",
    "Your area in Lusaka",
  ],
  cooking: [
    "Meal type and number of dishes",
    "Visit length",
    "Extra tasks added",
    "Your area in Lusaka",
  ],
  laundry: [
    "Load size and service type",
    "Visit length",
    "Ironing or delicate care add-ons",
    "Your area in Lusaka",
  ],
  garden: [
    "Yard size and tasks selected",
    "Visit length",
    "Extra tasks added",
    "Your area in Lusaka",
  ],
  handyman: [
    "Type of repair selected",
    "Visit length",
    "Parts and materials needed",
    "Extra tasks added",
    "Your area in Lusaka",
  ],
};

const CATEGORY_PREPARE: Record<ServiceCategoryKey, string[]> = {
  cleaning: [
    "Please make sure cleaning supplies are available",
    "Keep valuables safely stored",
    "Let us know about pets, parking, or access instructions",
  ],
  nanny: [
    "Share children's ages and any allergies",
    "Leave emergency contact details ready",
    "Let us know about pets, parking, or house rules",
  ],
  housekeeping: [
    "List the main duties you want covered",
    "Make sure supplies are available if needed",
    "Let us know about pets, parking, or access instructions",
  ],
  cooking: [
    "Check ingredients are available or list what to buy",
    "Share dietary needs or allergies",
    "Let us know about kitchen access and parking",
  ],
  laundry: [
    "Sort laundry and note any delicate items",
    "Confirm machine access and detergent on site",
    "Let us know about parking or gate instructions",
  ],
  garden: [
    "Confirm water access and areas to focus on",
    "Note any tools already on site",
    "Let us know about parking or gate instructions",
  ],
  handyman: [
    "Describe the issue clearly and add photos if you can",
    "Note whether parts are already on site",
    "Let us know about parking, access, or pets",
  ],
};

export function resolveSelectionSummary(
  category: ServiceCategoryKey,
  type: ServiceTypeOption
): string {
  return type.selectionSummary ?? CATEGORY_SELECTION_FALLBACK[category];
}

export function resolvePriceDrivers(
  category: ServiceCategoryKey,
  type: ServiceTypeOption
): string[] {
  return type.priceDrivers ?? CATEGORY_PRICE_DRIVERS[category];
}

export function resolvePrepareBeforeVisit(
  category: ServiceCategoryKey,
  type: ServiceTypeOption
): string[] {
  return type.prepareBeforeVisit ?? CATEGORY_PREPARE[category];
}

export function getServiceDetailsType(
  category: ServiceCategoryKey,
  serviceType: string
): ServiceTypeOption | null {
  return getServiceType(category, serviceType) ?? null;
}
