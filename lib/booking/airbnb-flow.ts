import { finalizeLusakaAddress } from "@/lib/lusaka/places";

export type AirbnbFlowStep = "address" | "plan" | "scope";

export type AirbnbWhenPreference = "today" | "last_minute" | "tomorrow_later";

export type LinenPreference = "replace_no_wash" | "wash_repack" | "basket_only";

export const AIRBNB_FLOW_STEPS: { id: AirbnbFlowStep; label: string }[] = [
  { id: "address", label: "Property" },
  { id: "plan", label: "Schedule" },
  { id: "scope", label: "Job details" },
];

export function formatAirbnbAddress(street: string, unit?: string): string {
  return finalizeLusakaAddress(street, unit);
}

export function todayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function tomorrowIsoDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function formatWhenPreference(pref?: AirbnbWhenPreference): string {
  switch (pref) {
    case "today":
      return "As soon as possible (today)";
    case "last_minute":
      return "Same-day urgent";
    case "tomorrow_later":
      return "Scheduled date";
    default:
      return "";
  }
}

export function formatTurnoverCadence(frequency?: string): string {
  switch (frequency) {
    case "once":
      return "One-time clean";
    case "per_checkout":
      return "After every guest";
    case "weekly":
      return "Every week";
    case "every_2_weeks":
      return "Every two weeks";
    default:
      return "One-time clean";
  }
}

export const LINEN_OPTIONS: {
  id: LinenPreference;
  label: string;
  description: string;
}[] = [
  {
    id: "replace_no_wash",
    label: "Remake beds only",
    description: "Use fresh linen you leave on site. No washing during the visit.",
  },
  {
    id: "wash_repack",
    label: "Wash and repack linen",
    description: "Bedding, mats, and towels. Book extra time for laundry.",
  },
  {
    id: "basket_only",
    label: "Collect for laundry basket",
    description: "Dirty linen goes in your basket. You handle washing separately.",
  },
];

export function formatLinenPreferences(prefs: LinenPreference[]): string {
  if (!prefs.length) return "";
  return prefs
    .map((id) => LINEN_OPTIONS.find((o) => o.id === id)?.label ?? id)
    .join(", ");
}

export const AIRBNB_EXTRA_TASKS = [
  {
    id: "appliances",
    label: "Appliance detail",
    description: "Microwave, kettle, toaster, and coffee machine",
  },
  {
    id: "restock_supplies",
    label: "Kitchen restock",
    description: "Top up tea, coffee, sugar, washing up liquid, and paper towels you keep on site",
  },
  {
    id: "restock_toiletries",
    label: "Bathroom restock",
    description: "Refill soap, shampoo, and toiletries you already stock",
  },
] as const;
