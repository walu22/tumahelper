import type { ServiceCategoryKey } from "@/lib/services/catalog";

export interface BookingStartSlot {
  value: string;
  label: string;
}

const ALL_SLOTS: BookingStartSlot[] = [
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
];

const CLEANING_VALUES = new Set(["08:00", "09:00", "10:00", "12:00", "14:00", "16:00"]);

/** Daytime slots for cleaning; nannies also get early morning + evening babysitting starts */
export function getBookingStartSlots(category?: ServiceCategoryKey): BookingStartSlot[] {
  if (category === "nanny") return ALL_SLOTS;
  return ALL_SLOTS.filter((s) => CLEANING_VALUES.has(s.value));
}

export function formatBookingTime(value: string): string {
  const slot = ALL_SLOTS.find((s) => s.value === value);
  if (slot) return slot.label;
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m ?? 0).toString().padStart(2, "0")} ${period}`;
}
