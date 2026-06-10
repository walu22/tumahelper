import type { ServiceCategoryKey } from "@/lib/services/catalog";

export interface BookingTimeWindow {
  /** Default / anchor start time for the window (HH:mm) */
  value: string;
  title: string;
  subtitle: string;
  /** Inclusive window start (hour, can be .5) */
  startHour: number;
  /** Exclusive window end (hour, can be .5) */
  endHour: number;
}

export interface BookingStartSlot {
  value: string;
  label: string;
  /** When the visit ends if this start is chosen */
  endLabel: string;
  selectable: boolean;
  group?: "available" | "too_late";
}

const CLEANING_WINDOWS: BookingTimeWindow[] = [
  {
    value: "08:00",
    title: "Morning",
    subtitle: "8:00 AM – 12:00 PM",
    startHour: 8,
    endHour: 12,
  },
  {
    value: "12:00",
    title: "Midday",
    subtitle: "12:00 – 2:00 PM",
    startHour: 12,
    endHour: 14,
  },
  {
    value: "14:00",
    title: "Afternoon",
    subtitle: "2:00 – 5:00 PM",
    startHour: 14,
    endHour: 17,
  },
];

const NANNY_EXTRA_WINDOWS: BookingTimeWindow[] = [
  {
    value: "07:00",
    title: "Early morning",
    subtitle: "7:00 – 9:00 AM",
    startHour: 7,
    endHour: 9,
  },
  {
    value: "17:00",
    title: "Evening",
    subtitle: "5:00 – 9:00 PM",
    startHour: 17,
    endHour: 21,
  },
];

const ALL_WINDOWS: BookingTimeWindow[] = [
  NANNY_EXTRA_WINDOWS[0],
  ...CLEANING_WINDOWS,
  NANNY_EXTRA_WINDOWS[1],
];

const SLOT_STEP_HOURS = 0.5;

function padTime(hour: number, minute = 0) {
  return `${String(Math.floor(hour)).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function parseTimeValue(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h + (Number.isNaN(m) ? 0 : m) / 60;
}

function formatTime12(value: string) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m ?? 0).padStart(2, "0")} ${period}`;
}

function addHoursToTime(startValue: string, hours: number) {
  const totalMinutes = Math.round(parseTimeValue(startValue) * 60 + hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return padTime(h, m);
}

/** Time windows for booking — value is the default start time for the window */
export function getBookingTimeWindows(category?: ServiceCategoryKey): BookingTimeWindow[] {
  if (category === "nanny") return ALL_WINDOWS;
  return CLEANING_WINDOWS;
}

export function getWindowForStartTime(
  serviceTime: string,
  category?: ServiceCategoryKey
): BookingTimeWindow | undefined {
  if (!serviceTime) return undefined;
  const start = parseTimeValue(serviceTime);
  const matches = getBookingTimeWindows(category).filter(
    (window) => start >= window.startHour && start < window.endHour
  );
  if (matches.length === 0) return undefined;
  if (matches.length === 1) return matches[0];

  // Overlapping windows (e.g. Early morning 7–9 vs Morning 8–12): prefer the wider
  // window so 8:00 AM maps to Morning, not Early morning.
  return matches.reduce((best, window) =>
    window.endHour - window.startHour > best.endHour - best.startHour ? window : best
  );
}

/** 30-minute start slots inside a window, filtered by booking duration (SweepSouth-style). */
export function getStartSlotsForWindow(
  window: BookingTimeWindow,
  durationHours: number
): BookingStartSlot[] {
  const slots: BookingStartSlot[] = [];
  const safeDuration = Math.max(durationHours, 0.5);

  for (
    let hour = window.startHour;
    hour < window.endHour;
    hour += SLOT_STEP_HOURS
  ) {
    const value = padTime(hour, Number.isInteger(hour) ? 0 : 30);
    const endValue = addHoursToTime(value, safeDuration);
    const endHour = parseTimeValue(endValue);
    const selectable = endHour <= window.endHour + 1e-9;
    const label = `${formatTime12(value)} – ${formatTime12(endValue)}`;

    slots.push({
      value,
      label,
      endLabel: formatTime12(endValue),
      selectable,
      group: selectable ? "available" : "too_late",
    });
  }

  return slots;
}

export function getFirstSelectableSlot(
  window: BookingTimeWindow,
  durationHours: number
): BookingStartSlot | undefined {
  return getStartSlotsForWindow(window, durationHours).find((slot) => slot.selectable);
}

export function isWindowAvailable(window: BookingTimeWindow, durationHours: number) {
  return getStartSlotsForWindow(window, durationHours).some((slot) => slot.selectable);
}

export function isStartTimeValid(
  serviceTime: string,
  durationHours: number,
  category?: ServiceCategoryKey
) {
  const window = getWindowForStartTime(serviceTime, category);
  if (!window) return false;
  const slot = getStartSlotsForWindow(window, durationHours).find((s) => s.value === serviceTime);
  return !!slot?.selectable;
}

export function formatBookingTime(value: string): string {
  const window = ALL_WINDOWS.find((w) => w.value === value);
  if (window) return `${window.title} (${window.subtitle})`;

  const matchedWindow = getWindowForStartTime(value);
  if (matchedWindow) {
    return `${formatTime12(value)} (${matchedWindow.title.toLowerCase()})`;
  }

  return formatTime12(value);
}
