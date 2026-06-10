import type { ServiceCategoryKey } from "@/lib/services/catalog";

export interface BookingTimeWindow {
  /** Start time stored in booking (HH:mm) */
  value: string;
  title: string;
  subtitle: string;
}

const CLEANING_WINDOWS: BookingTimeWindow[] = [
  { value: "08:00", title: "Morning", subtitle: "8:00 AM – 12:00 PM" },
  { value: "12:00", title: "Midday", subtitle: "12:00 – 2:00 PM" },
  { value: "14:00", title: "Afternoon", subtitle: "2:00 – 5:00 PM" },
];

const NANNY_EXTRA_WINDOWS: BookingTimeWindow[] = [
  { value: "07:00", title: "Early morning", subtitle: "7:00 – 9:00 AM" },
  { value: "17:00", title: "Evening", subtitle: "5:00 – 9:00 PM" },
];

const ALL_WINDOWS: BookingTimeWindow[] = [
  NANNY_EXTRA_WINDOWS[0],
  ...CLEANING_WINDOWS,
  NANNY_EXTRA_WINDOWS[1],
];

/** Time windows for booking — value is the window start time sent to the API */
export function getBookingTimeWindows(category?: ServiceCategoryKey): BookingTimeWindow[] {
  if (category === "nanny") return ALL_WINDOWS;
  return CLEANING_WINDOWS;
}

export function formatBookingTime(value: string): string {
  const window = ALL_WINDOWS.find((w) => w.value === value);
  if (window) return `${window.title} (${window.subtitle})`;

  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m ?? 0).toString().padStart(2, "0")} ${period}`;
}
