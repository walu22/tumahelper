import type { ServiceCategoryKey } from "@/lib/services/catalog";

export type ArrivalPeriod = "morning" | "afternoon" | "evening";

export interface ArrivalTimeOption {
  value: string;
  label: string;
  period: ArrivalPeriod;
  /** Latest hour the visit may end (24h, e.g. 17 = 5 PM) */
  latestEndHour: number;
}

export interface ArrivalTimeChoice extends ArrivalTimeOption {
  selectable: boolean;
  finishLabel: string;
}

const PERIOD_LABELS: Record<ArrivalPeriod, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const PERIOD_HINTS: Record<ArrivalPeriod, string> = {
  morning: "8 AM – 12 PM",
  afternoon: "12 PM – 5 PM",
  evening: "5 PM – 9 PM",
};

const DAYTIME_ARRIVALS: ArrivalTimeOption[] = [
  { value: "08:00", label: "8:00 AM", period: "morning", latestEndHour: 17 },
  { value: "09:00", label: "9:00 AM", period: "morning", latestEndHour: 17 },
  { value: "10:00", label: "10:00 AM", period: "morning", latestEndHour: 17 },
  { value: "11:00", label: "11:00 AM", period: "morning", latestEndHour: 17 },
  { value: "12:00", label: "12:00 PM", period: "afternoon", latestEndHour: 17 },
  { value: "13:00", label: "1:00 PM", period: "afternoon", latestEndHour: 17 },
  { value: "14:00", label: "2:00 PM", period: "afternoon", latestEndHour: 17 },
  { value: "15:00", label: "3:00 PM", period: "afternoon", latestEndHour: 17 },
  { value: "16:00", label: "4:00 PM", period: "afternoon", latestEndHour: 17 },
];

const EVENING_ARRIVALS: ArrivalTimeOption[] = [
  { value: "17:00", label: "5:00 PM", period: "evening", latestEndHour: 21 },
  { value: "18:00", label: "6:00 PM", period: "evening", latestEndHour: 21 },
  { value: "19:00", label: "7:00 PM", period: "evening", latestEndHour: 21 },
  { value: "20:00", label: "8:00 PM", period: "evening", latestEndHour: 21 },
];

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

function finishTimeLabel(startValue: string, durationHours: number) {
  const endHour = parseTimeValue(startValue) + durationHours;
  const h = Math.floor(endHour);
  const m = Math.round((endHour - h) * 60);
  return formatTime12(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}

export function getArrivalTimeOptions(category?: ServiceCategoryKey): ArrivalTimeOption[] {
  if (category === "nanny") return [...DAYTIME_ARRIVALS, ...EVENING_ARRIVALS];
  return DAYTIME_ARRIVALS;
}

export function getArrivalChoices(
  category: ServiceCategoryKey | undefined,
  durationHours: number
): ArrivalTimeChoice[] {
  const duration = Math.max(durationHours, 0.5);
  return getArrivalTimeOptions(category).map((option) => {
    const finishHour = parseTimeValue(option.value) + duration;
    const selectable = finishHour <= option.latestEndHour + 1e-9;
    return {
      ...option,
      selectable,
      finishLabel: finishTimeLabel(option.value, duration),
    };
  });
}

export function getArrivalChoice(
  serviceTime: string,
  category: ServiceCategoryKey | undefined,
  durationHours: number
): ArrivalTimeChoice | undefined {
  return getArrivalChoices(category, durationHours).find(
    (choice) => choice.value === serviceTime
  );
}

export function isArrivalTimeValid(
  serviceTime: string,
  durationHours: number,
  category?: ServiceCategoryKey
) {
  const choice = getArrivalChoice(serviceTime, category, durationHours);
  return !!choice?.selectable;
}

export function getArrivalPeriodGroups(
  category: ServiceCategoryKey | undefined,
  durationHours: number
) {
  const choices = getArrivalChoices(category, durationHours);
  const periods: ArrivalPeriod[] =
    category === "nanny" ? ["morning", "afternoon", "evening"] : ["morning", "afternoon"];

  return periods
    .map((period) => ({
      period,
      label: PERIOD_LABELS[period],
      hint: PERIOD_HINTS[period],
      choices: choices.filter((choice) => choice.period === period),
    }))
    .filter((group) => group.choices.length > 0);
}

export function formatBookingTime(value: string): string {
  if (!value) return "";
  return formatTime12(value);
}

/** @deprecated Use formatBookingTime — kept for any legacy window-style values */
export function getBookingTimeWindows(category?: ServiceCategoryKey) {
  return getArrivalTimeOptions(category).map((option) => ({
    value: option.value,
    title: option.label,
    subtitle: PERIOD_HINTS[option.period],
    startHour: parseTimeValue(option.value),
    endHour: option.latestEndHour,
  }));
}
