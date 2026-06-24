import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { DURATION_OPTIONS } from "@/lib/services/catalog";
import {
  clampStartTimeForDuration,
  getAllowedDurations,
} from "@/lib/booking/time-slots";

export function stepBookingDuration(
  current: number,
  delta: number,
  serviceTime: string,
  category: ServiceCategoryKey,
  serviceType: string
): { durationHours: number; serviceTime: string } {
  const allowed = getAllowedDurations(serviceTime, category, serviceType);
  const fallback = allowed.length > 0 ? allowed : [...DURATION_OPTIONS];
  const idx = Math.max(0, fallback.indexOf(current as (typeof DURATION_OPTIONS)[number]));
  const nextIdx = Math.max(0, Math.min(fallback.length - 1, idx + delta));
  const durationHours = fallback[nextIdx] ?? current;
  const nextTime = clampStartTimeForDuration(serviceTime, durationHours, category, serviceType);
  return { durationHours, serviceTime: nextTime };
}

export function resolveDurationForSchedule(
  durationHours: number,
  serviceTime: string,
  category: ServiceCategoryKey,
  serviceType: string
): { durationHours: number; serviceTime: string } {
  const allowed = getAllowedDurations(serviceTime, category, serviceType);
  const resolved =
    allowed.length === 0
      ? durationHours
      : allowed.includes(durationHours as (typeof DURATION_OPTIONS)[number])
        ? durationHours
        : allowed[allowed.length - 1];
  const nextTime = clampStartTimeForDuration(serviceTime, resolved, category, serviceType);
  return { durationHours: resolved, serviceTime: nextTime };
}

export function canIncreaseDuration(
  current: number,
  serviceTime: string,
  category: ServiceCategoryKey,
  serviceType: string
): boolean {
  const allowed = getAllowedDurations(serviceTime, category, serviceType);
  const max = allowed[allowed.length - 1];
  return max !== undefined && current < max;
}
