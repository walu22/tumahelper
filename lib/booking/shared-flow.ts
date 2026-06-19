import { finalizeLusakaAddress } from "@/lib/lusaka/places";
import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { isAirbnbCleaningType, TURNOVER_FREQUENCY_OPTIONS } from "@/lib/services/catalog";

export type ServiceFlowStep = "address" | "plan" | "scope";

export type WhenPreference = "today" | "last_minute" | "tomorrow_later";

export const REGULAR_FREQUENCY_OPTIONS = TURNOVER_FREQUENCY_OPTIONS.filter(
  (o) => o.id !== "once" && o.id !== "per_checkout"
);

export function getFlowSteps(
  category: ServiceCategoryKey,
  serviceType?: string
): { id: ServiceFlowStep; label: string }[] {
  if (category === "nanny") {
    return [
      { id: "address", label: "Your home" },
      { id: "plan", label: "Schedule" },
      { id: "scope", label: "Care details" },
    ];
  }
  if (serviceType && isAirbnbCleaningType(serviceType)) {
    return [
      { id: "address", label: "Property" },
      { id: "plan", label: "Schedule" },
      { id: "scope", label: "Clean details" },
    ];
  }
  return [
    { id: "address", label: "Your home" },
    { id: "plan", label: "Schedule" },
    { id: "scope", label: "Job details" },
  ];
}

export function formatServiceAddress(street: string, unit?: string): string {
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

export function formatWhenPreference(pref?: WhenPreference): string {
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

export function formatVisitCadence(
  frequency?: string,
  options?: { category?: ServiceCategoryKey; serviceType?: string }
): string {
  const isAirbnbTurnover = options?.serviceType
    ? isAirbnbCleaningType(options.serviceType)
    : false;

  if (isAirbnbTurnover) {
    return (
      TURNOVER_FREQUENCY_OPTIONS.find((o) => o.id === frequency)?.label ?? "One-time clean"
    );
  }

  const visitLabels: Record<string, string> = {
    once: "One-time visit",
    weekly: "Every week",
    every_2_weeks: "Every two weeks",
  };

  return visitLabels[frequency ?? "once"] ?? "One-time visit";
}

export function getBookingPageTitle(
  category: ServiceCategoryKey,
  serviceType?: string
): string {
  if (serviceType && isAirbnbCleaningType(serviceType)) return "Book Airbnb cleaning";
  if (category === "nanny") return "Book a nanny";
  return "Book house cleaning";
}
