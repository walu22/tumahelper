import type { ServiceCategoryKey } from "@/lib/services/catalog";

export interface StartTimeOption {
  /** Stored on the booking (HH:mm) */
  value: string;
  /** Shown in the dropdown, SweepSouth-style: "8:00 AM – 8:30 AM" */
  label: string;
}

function padTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatTime12(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
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
      label: `${formatTime12(hour, minute)} – ${formatTime12(endHourPart, endMinutePart)}`,
    });
  }
  return slots;
}

const CLEANING_START_TIMES = buildHalfHourSlots(8, 17);
const NANNY_START_TIMES = [
  ...buildHalfHourSlots(7, 17),
  ...buildHalfHourSlots(17, 21),
];

export function getStartTimeOptions(category?: ServiceCategoryKey): StartTimeOption[] {
  if (category === "nanny") return NANNY_START_TIMES;
  return CLEANING_START_TIMES;
}

export function formatBookingTime(value: string): string {
  if (!value) return "";
  const option = [...CLEANING_START_TIMES, ...NANNY_START_TIMES].find((o) => o.value === value);
  if (option) return option.label.split(" – ")[0] ?? option.label;

  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h)) return value;
  return formatTime12(h, m ?? 0);
}
