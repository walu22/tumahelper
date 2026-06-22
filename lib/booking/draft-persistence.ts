import type { ServiceFlowStep } from "@/lib/booking/shared-flow";
import type { LocationCoords } from "@/lib/lusaka/geolocation";
import type { ServiceDetails } from "@/lib/services/catalog";

const DRAFT_KEY = "tumahelper_booking_draft";

export interface BookingDraft {
  pathname: string;
  search: string;
  step: number;
  serviceSubStep: ServiceFlowStep;
  serviceDetails: ServiceDetails | null;
  serviceDate: string;
  serviceTime: string;
  locationAddress: string;
  locationCoords: LocationCoords | null;
  streetAddress: string;
  unitAddress: string;
  description: string;
  guestCheckoutTime: string;
  nextCheckIn: string;
  amount: string;
}

export function saveBookingDraft(draft: BookingDraft): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore quota / private mode
  }
}

export function loadBookingDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BookingDraft;
  } catch {
    return null;
  }
}

export function clearBookingDraft(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function draftMatchesReturnUrl(
  draft: BookingDraft,
  pathname: string,
  search: string
): boolean {
  return draft.pathname === pathname && draft.search === search;
}
