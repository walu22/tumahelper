import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { isAirbnbCleaningType } from "@/lib/services/catalog";
import { DURATION_OPTIONS } from "@/lib/services/catalog";

export interface StartTimeOption {
  /** Stored on the booking (HH:mm) */
  value: string;
  /** Shown in the dropdown, e.g. "8:00 AM to 8:30 AM" */
  label: string;
}

export type WhenPreference = "today" | "last_minute" | "tomorrow_later";

export interface ScheduleFeasibility {
  valid: boolean;
  endTimeLabel: string;
  serviceWindowLabel: string;
  latestStartValue: string | null;
  latestStartLabel: string | null;
  message: string | null;
}

function padTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatTime12(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function parseTimeToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minutesToTimeValue(minutes: number): string {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return padTime(hour, minute);
}

export function formatMinutesTo12(totalMinutes: number): string {
  const minutesInDay = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour = Math.floor(minutesInDay / 60);
  const minute = minutesInDay % 60;
  return formatTime12(hour, minute);
}

/** Half-hour slots from startHour up to (but not including) endHour */
function buildHalfHourSlots(startHour: number, endHour: number): StartTimeOption[] {
  const slots: StartTimeOption[] = [];
  for (let h = startHour; h < endHour; h += 0.5) {
    const hour = Math.floor(h);
    const minute = h % 1 === 0 ? 0 : 30;
    const endTotal = h + 0.5;
    const endHourPart = Math.floor(endTotal);
    const endMinutePart = endTotal % 1 === 0 ? 0 : 30;
    slots.push({
      value: padTime(hour, minute),
      label: `${formatTime12(hour, minute)} to ${formatTime12(endHourPart, endMinutePart)}`,
    });
  }
  return slots;
}

const CLEANING_START_TIMES = buildHalfHourSlots(8, 17);
const NANNY_START_TIMES = [
  ...buildHalfHourSlots(7, 17),
  ...buildHalfHourSlots(17, 21),
];

export function getStartTimeOptions(category?: ServiceCategoryKey, serviceType?: string): StartTimeOption[] {
  if (category === "nanny") return NANNY_START_TIMES;
  if (serviceType && isAirbnbCleaningType(serviceType)) return buildHalfHourSlots(7, 18);
  return CLEANING_START_TIMES;
}

function isNannyEveningStart(startTime: string): boolean {
  return parseTimeToMinutes(startTime) >= 17 * 60;
}

/** Latest minute-of-day the visit must finish by (exclusive of next slot). */
export function getServiceEndMinutes(
  category?: ServiceCategoryKey,
  serviceType?: string,
  startTime?: string
): number {
  if (category === "nanny" && startTime && isNannyEveningStart(startTime)) {
    return 21 * 60;
  }
  if (category === "nanny") return 17 * 60;
  if (serviceType && isAirbnbCleaningType(serviceType)) return 18 * 60;
  return 17 * 60;
}

export function getServiceWindowLabel(
  category?: ServiceCategoryKey,
  serviceType?: string,
  startTime?: string
): string {
  if (category === "nanny" && startTime && isNannyEveningStart(startTime)) {
    return "5:00 PM to 9:00 PM";
  }
  if (category === "nanny") return "7:00 AM to 5:00 PM";
  if (serviceType && isAirbnbCleaningType(serviceType)) return "7:00 AM to 6:00 PM";
  return "8:00 AM to 5:00 PM";
}

export function getEstimatedEndMinutes(startTime: string, durationHours: number): number {
  return parseTimeToMinutes(startTime) + durationHours * 60;
}

export function formatEstimatedEnd(startTime: string, durationHours: number): string {
  const endMinutes = getEstimatedEndMinutes(startTime, durationHours);
  const dayOffset = Math.floor(endMinutes / (24 * 60));
  const label = formatMinutesTo12(endMinutes);
  if (dayOffset > 0) return `${label} (next day)`;
  return label;
}

export function isStartTimeValidForDuration(
  startTime: string,
  durationHours: number,
  category?: ServiceCategoryKey,
  serviceType?: string
): boolean {
  if (!startTime || !durationHours) return false;
  const endLimit = getServiceEndMinutes(category, serviceType, startTime);
  return getEstimatedEndMinutes(startTime, durationHours) <= endLimit;
}

export function filterStartTimesByDuration(
  times: StartTimeOption[],
  durationHours: number,
  category?: ServiceCategoryKey,
  serviceType?: string
): StartTimeOption[] {
  return times.filter((slot) =>
    isStartTimeValidForDuration(slot.value, durationHours, category, serviceType)
  );
}

export function filterUrgentSameDaySlots(
  times: StartTimeOption[],
  serviceDate: string,
  whenPreference?: WhenPreference,
  todayIsoDate: () => string = defaultTodayIsoDate
): StartTimeOption[] {
  if (serviceDate !== todayIsoDate()) return times;
  if (whenPreference !== "last_minute") return times;

  const minHour = new Date().getHours() + 1;
  const filtered = times.filter((slot) => {
    const hour = parseInt(slot.value.split(":")[0] ?? "0", 10);
    return hour >= minHour;
  });
  return filtered.length > 0 ? filtered : times.slice(-3);
}

function defaultTodayIsoDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getAvailableStartTimes(options: {
  category?: ServiceCategoryKey;
  serviceType?: string;
  serviceDate?: string;
  whenPreference?: WhenPreference;
  durationHours?: number;
}): StartTimeOption[] {
  let times = getStartTimeOptions(options.category, options.serviceType);
  times = filterUrgentSameDaySlots(times, options.serviceDate ?? "", options.whenPreference);
  if (options.durationHours && options.durationHours > 0) {
    times = filterStartTimesByDuration(
      times,
      options.durationHours,
      options.category,
      options.serviceType
    );
  }
  return times;
}

export function getLatestStartForDuration(
  durationHours: number,
  category?: ServiceCategoryKey,
  serviceType?: string
): StartTimeOption | null {
  const valid = filterStartTimesByDuration(
    getStartTimeOptions(category, serviceType),
    durationHours,
    category,
    serviceType
  );
  return valid[valid.length - 1] ?? null;
}

export function getMaxDurationHours(
  startTime: string,
  category?: ServiceCategoryKey,
  serviceType?: string
): number {
  if (!startTime) return DURATION_OPTIONS[DURATION_OPTIONS.length - 1];
  const endLimit = getServiceEndMinutes(category, serviceType, startTime);
  const availableMinutes = endLimit - parseTimeToMinutes(startTime);
  let maxHours = availableMinutes / 60;
  if (category === "nanny" && isNannyEveningStart(startTime)) {
    maxHours = Math.min(4, maxHours);
  }
  return maxHours;
}

export function getAllowedDurations(
  startTime: string,
  category?: ServiceCategoryKey,
  serviceType?: string
): number[] {
  const maxHours = getMaxDurationHours(startTime, category, serviceType);
  return DURATION_OPTIONS.filter((hours) => hours <= maxHours);
}

export function clampStartTimeForDuration(
  startTime: string,
  durationHours: number,
  category?: ServiceCategoryKey,
  serviceType?: string
): string {
  if (!startTime || !durationHours) return startTime;
  if (isStartTimeValidForDuration(startTime, durationHours, category, serviceType)) {
    return startTime;
  }

  const valid = filterStartTimesByDuration(
    getStartTimeOptions(category, serviceType),
    durationHours,
    category,
    serviceType
  );
  if (valid.length === 0) return startTime;

  const startMins = parseTimeToMinutes(startTime);
  const atOrBefore = valid.filter((slot) => parseTimeToMinutes(slot.value) <= startMins);
  if (atOrBefore.length > 0) {
    return atOrBefore[atOrBefore.length - 1].value;
  }
  return valid[0].value;
}

export function getScheduleFeasibility(options: {
  startTime: string;
  durationHours: number;
  category?: ServiceCategoryKey;
  serviceType?: string;
}): ScheduleFeasibility {
  const { startTime, durationHours, category, serviceType } = options;
  const valid = isStartTimeValidForDuration(startTime, durationHours, category, serviceType);
  const endTimeLabel = formatEstimatedEnd(startTime, durationHours);
  const serviceWindowLabel = getServiceWindowLabel(category, serviceType, startTime);
  const latest = getLatestStartForDuration(durationHours, category, serviceType);

  let message: string | null = null;
  if (!valid) {
    const latestLabel = latest ? formatBookingTime(latest.value) : null;
    message = latestLabel
      ? `${durationHours}-hour visits must start by ${latestLabel}.`
      : `This visit length does not fit within standard hours (${serviceWindowLabel}).`;
  }

  return {
    valid,
    endTimeLabel,
    serviceWindowLabel,
    latestStartValue: latest?.value ?? null,
    latestStartLabel: latest ? formatBookingTime(latest.value) : null,
    message,
  };
}

export function formatBookingTime(value: string): string {
  if (!value) return "";
  const option = [...CLEANING_START_TIMES, ...NANNY_START_TIMES].find((o) => o.value === value);
  if (option) return option.label.split(" to ")[0] ?? option.label;

  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h)) return value;
  return formatTime12(h, m ?? 0);
}
