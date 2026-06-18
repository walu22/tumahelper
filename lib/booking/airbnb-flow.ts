export type AirbnbFlowStep = "address" | "plan" | "scope";

export type AirbnbWhenPreference = "today" | "last_minute" | "tomorrow_later";

export type LinenPreference = "replace_no_wash" | "wash_repack" | "basket_only";

export function formatAirbnbAddress(street: string, unit?: string): string {
  const streetPart = street.trim();
  const unitPart = unit?.trim();
  if (!streetPart) return "";
  const parts = [streetPart];
  if (unitPart) parts.push(unitPart);
  parts.push("Lusaka", "Zambia");
  return parts.join(", ");
}

export function todayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function tomorrowIsoDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export const LINEN_OPTIONS: {
  id: LinenPreference;
  label: string;
  description: string;
}[] = [
  {
    id: "replace_no_wash",
    label: "Replace linen but do not wash",
    description: "Remake beds with fresh linen you provide on site",
  },
  {
    id: "wash_repack",
    label: "Wash, dry, and repack linen",
    description: "Includes bedding, mats, and towels. Allow extra time",
  },
  {
    id: "basket_only",
    label: "Place used laundry in the basket",
    description: "Collect dirty linen and towels for you to handle later",
  },
];

export const AIRBNB_EXTRA_TASKS = [
  {
    id: "appliances",
    label: "Clean appliances",
    description: "Microwave, kettle, toaster, and coffee machine",
  },
  {
    id: "restock_supplies",
    label: "Restock supplies",
    description: "Tea, coffee, sugar, dishwashing liquid, and paper towels you keep on site",
  },
  {
    id: "restock_toiletries",
    label: "Restock toiletries",
    description: "Soap, shampoo, conditioner, and body wash you keep on site",
  },
] as const;
