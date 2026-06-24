export const LUSAKA_TIME_ZONE = "Africa/Lusaka";

export interface LusakaZonedParts {
  year: string;
  month: string;
  day: string;
  hour: number;
  minute: number;
}

export function getLusakaZonedParts(date: Date = new Date()): LusakaZonedParts {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: LUSAKA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "0";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: parseInt(get("hour"), 10),
    minute: parseInt(get("minute"), 10),
  };
}

/** Calendar date in Lusaka (YYYY-MM-DD). */
export function getLusakaTodayIsoDate(now: Date = new Date()): string {
  const { year, month, day } = getLusakaZonedParts(now);
  return `${year}-${month}-${day}`;
}

export function getLusakaTomorrowIsoDate(now: Date = new Date()): string {
  const today = getLusakaTodayIsoDate(now);
  const [year, month, day] = today.split("-").map(Number);
  const anchor = new Date(Date.UTC(year, month - 1, day, 12));
  anchor.setUTCDate(anchor.getUTCDate() + 1);
  return getLusakaTodayIsoDate(anchor);
}

/** Minutes since midnight in Lusaka for the given instant. */
export function getLusakaNowMinutes(now: Date = new Date()): number {
  const { hour, minute } = getLusakaZonedParts(now);
  return hour * 60 + minute;
}

export function isLusakaSameDay(serviceDate: string, now: Date = new Date()): boolean {
  return serviceDate === getLusakaTodayIsoDate(now);
}

export function isServiceDateBeforeToday(
  serviceDate: string,
  now: Date = new Date()
): boolean {
  return serviceDate < getLusakaTodayIsoDate(now);
}
