import type { ServiceCategoryKey, ServiceDetails } from "@/lib/services/catalog";
import { DURATION_OPTIONS } from "@/lib/services/catalog";
import { suggestDuration } from "@/lib/services/utils";
import {
  clampStartTimeForDuration,
  getAllowedDurations,
  getEffectiveDurationHours,
  isScheduleBookable,
} from "@/lib/booking/time-slots";

/** After home size / add-ons change suggested length, keep start time feasible. */
export function syncDetailsWithSchedule(
  nextDetails: ServiceDetails,
  serviceTime: string,
  serviceDate?: string
): { details: ServiceDetails; serviceTime: string } {
  const suggestedHours = suggestDuration(nextDetails);
  const { durationHours, serviceTime: nextTime } = resolveDurationForSchedule(
    suggestedHours,
    serviceTime,
    nextDetails.category,
    nextDetails.serviceType,
    serviceDate
  );
  return {
    details: { ...nextDetails, durationHours },
    serviceTime: nextTime,
  };
}

export function canProceedWithSchedule(
  serviceDate: string,
  serviceTime: string,
  durationHours: number,
  category: ServiceCategoryKey,
  serviceType: string,
  now?: Date
): boolean {
  return isScheduleBookable({
    serviceDate,
    startTime: serviceTime,
    durationHours,
    category,
    serviceType,
    now,
  });
}

export function stepBookingDuration(
  current: number,
  delta: number,
  serviceTime: string,
  category: ServiceCategoryKey,
  serviceType: string,
  serviceDate?: string
): { durationHours: number; serviceTime: string } {
  const allowed = getAllowedDurations(serviceTime, category, serviceType);
  const fallback = allowed.length > 0 ? allowed : [...DURATION_OPTIONS];
  const idx = Math.max(0, fallback.indexOf(current as (typeof DURATION_OPTIONS)[number]));
  const nextIdx = Math.max(0, Math.min(fallback.length - 1, idx + delta));
  const durationHours = fallback[nextIdx] ?? current;
  const nextTime = clampStartTimeForDuration(
    serviceTime,
    durationHours,
    category,
    serviceType,
    serviceDate
  );
  return { durationHours, serviceTime: nextTime };
}

export function resolveDurationForSchedule(
  durationHours: number,
  serviceTime: string,
  category: ServiceCategoryKey,
  serviceType: string,
  serviceDate?: string
): { durationHours: number; serviceTime: string } {
  const allowed = getAllowedDurations(serviceTime, category, serviceType);
  if (allowed.length === 0) {
    return {
      durationHours,
      serviceTime: clampStartTimeForDuration(
        serviceTime,
        durationHours,
        category,
        serviceType,
        serviceDate
      ),
    };
  }
  const resolved = allowed.includes(durationHours as (typeof DURATION_OPTIONS)[number])
    ? durationHours
    : allowed[allowed.length - 1];
  const nextTime = clampStartTimeForDuration(
    serviceTime,
    resolved,
    category,
    serviceType,
    serviceDate
  );
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
