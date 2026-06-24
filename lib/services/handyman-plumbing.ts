import type { ServiceDetails } from "@/lib/services/catalog";
import type { VerificationLevel } from "@/types";

export type PlumbingBookingMode =
  | "standard_repair_visit"
  | "inspection_only"
  | "specialist_quote_request"
  | "emergency_request";

export type PlumbingWorkerRouteType =
  | "general_plumber"
  | "specialist_plumber"
  | "drainage_sewer_specialist"
  | "borehole_pump_technician"
  | "emergency_plumber";

export type PartsAvailable = "yes" | "no" | "not_sure";
export type PlumberBuyParts = "yes_receipt" | "no_provide";

/** Set true when emergency plumbers are onboarded and can respond quickly. */
export const EMERGENCY_PLUMBING_AVAILABLE = false;

export const PLUMBING_SPECIALIST_NOTE =
  "Some plumbing jobs may require a specialist plumber, borehole technician, emergency plumber, or plumbing contractor. If your job falls outside a standard repair visit, we may recommend a specialist booking instead.";

export type PlumbingJobType = {
  id: string;
  label: string;
  routeToWorkerType: PlumbingWorkerRouteType;
  bookingMode: PlumbingBookingMode;
  requiresAdminReview: boolean;
  followUpQuestions?: ("active_leak" | "water_shutoff")[];
};

export const PLUMBING_JOB_TYPES: PlumbingJobType[] = [
  {
    id: "leaking_tap",
    label: "Leaking tap",
    routeToWorkerType: "general_plumber",
    bookingMode: "standard_repair_visit",
    requiresAdminReview: false,
  },
  {
    id: "replace_tap_mixer",
    label: "Replace tap / mixer",
    routeToWorkerType: "general_plumber",
    bookingMode: "standard_repair_visit",
    requiresAdminReview: false,
  },
  {
    id: "blocked_sink_drain",
    label: "Blocked sink or drain",
    routeToWorkerType: "general_plumber",
    bookingMode: "standard_repair_visit",
    requiresAdminReview: false,
  },
  {
    id: "toilet_flush_cistern",
    label: "Toilet flush / cistern issue",
    routeToWorkerType: "general_plumber",
    bookingMode: "standard_repair_visit",
    requiresAdminReview: false,
  },
  {
    id: "shower_head_replacement",
    label: "Replace shower head",
    routeToWorkerType: "general_plumber",
    bookingMode: "standard_repair_visit",
    requiresAdminReview: false,
  },
  {
    id: "visible_pipe_leak",
    label: "Visible pipe leak",
    routeToWorkerType: "general_plumber",
    bookingMode: "standard_repair_visit",
    requiresAdminReview: false,
    followUpQuestions: ["active_leak", "water_shutoff"],
  },
  {
    id: "low_water_pressure",
    label: "Low water pressure",
    routeToWorkerType: "general_plumber",
    bookingMode: "inspection_only",
    requiresAdminReview: false,
  },
  {
    id: "borehole_pump_issue",
    label: "Borehole / pump issue",
    routeToWorkerType: "borehole_pump_technician",
    bookingMode: "specialist_quote_request",
    requiresAdminReview: true,
  },
  {
    id: "underground_sewer_issue",
    label: "Underground / sewer issue",
    routeToWorkerType: "drainage_sewer_specialist",
    bookingMode: "specialist_quote_request",
    requiresAdminReview: true,
  },
  {
    id: "full_bathroom_plumbing",
    label: "Full bathroom plumbing",
    routeToWorkerType: "specialist_plumber",
    bookingMode: "specialist_quote_request",
    requiresAdminReview: true,
  },
  {
    id: "emergency_flooding",
    label: "Emergency flooding",
    routeToWorkerType: "emergency_plumber",
    bookingMode: "emergency_request",
    requiresAdminReview: true,
  },
  {
    id: "not_sure",
    label: "Not sure",
    routeToWorkerType: "general_plumber",
    bookingMode: "inspection_only",
    requiresAdminReview: false,
  },
];

const JOB_BY_ID = Object.fromEntries(
  PLUMBING_JOB_TYPES.map((job) => [job.id, job])
) as Record<string, PlumbingJobType>;

export function getPlumbingJobType(id: string | undefined): PlumbingJobType | null {
  if (!id) return null;
  return JOB_BY_ID[id] ?? null;
}

export function workerSkillsForPlumbingRoute(
  route: PlumbingWorkerRouteType
): string[] {
  if (route === "general_plumber") return ["general_plumber", "plumbing"];
  return [route];
}

export type ResolvedPlumbingJob = PlumbingJobType & {
  effectiveRoute: PlumbingWorkerRouteType;
  effectiveBookingMode: PlumbingBookingMode;
  effectiveRequiresAdminReview: boolean;
  blocked: boolean;
  blockedReason?: string;
};

export function isPlumbingService(serviceType: string | undefined): boolean {
  return serviceType === "plumbing";
}

export function resolvePlumbingJob(
  jobId: string,
  followUp?: { activeLeak?: boolean; waterShutoffAvailable?: boolean }
): ResolvedPlumbingJob | null {
  const job = getPlumbingJobType(jobId);
  if (!job) return null;

  let effectiveRoute = job.routeToWorkerType;
  let effectiveBookingMode = job.bookingMode;
  let effectiveRequiresAdminReview = job.requiresAdminReview;
  let blocked = false;
  let blockedReason: string | undefined;

  if (job.id === "visible_pipe_leak" && followUp?.activeLeak) {
    if (followUp.waterShutoffAvailable === false) {
      effectiveRoute = "emergency_plumber";
      effectiveBookingMode = "emergency_request";
      effectiveRequiresAdminReview = true;
    }
  }

  if (effectiveBookingMode === "emergency_request" && !EMERGENCY_PLUMBING_AVAILABLE) {
    blocked = true;
    blockedReason =
      "Emergency plumbing is not currently available on TumaHelper. Please contact a local emergency plumber immediately.";
  }

  return {
    ...job,
    effectiveRoute,
    effectiveBookingMode,
    effectiveRequiresAdminReview,
    blocked,
    blockedReason,
  };
}

export function applyPlumbingJobToDetails(
  details: ServiceDetails,
  jobId: string,
  followUp?: { activeLeak?: boolean; waterShutoffAvailable?: boolean }
): ServiceDetails {
  const resolved = resolvePlumbingJob(jobId, followUp);
  if (!resolved) return details;

  const addons =
    resolved.effectiveBookingMode === "inspection_only"
      ? Array.from(
          new Set([
            ...details.addons.filter((id) => id !== "inspection_only"),
            "inspection_only",
          ])
        )
      : details.addons.filter((id) => id !== "inspection_only");

  return {
    ...details,
    plumbingJobType: resolved.id,
    handymanBookingMode: resolved.effectiveBookingMode,
    routeToWorkerType: resolved.effectiveRoute,
    requiresAdminReview: resolved.effectiveRequiresAdminReview,
    activeLeak: followUp?.activeLeak,
    waterShutoffAvailable: followUp?.waterShutoffAvailable,
    addons,
  };
}

export function plumbingRequiresAdminReview(details: ServiceDetails): boolean {
  if (!isPlumbingService(details.serviceType)) return false;
  return details.requiresAdminReview === true;
}

export function plumbingSkipsWorkerSelection(details: ServiceDetails): boolean {
  return plumbingRequiresAdminReview(details);
}

export function isPlumbingBookingBlocked(details: ServiceDetails): boolean {
  if (!isPlumbingService(details.serviceType) || !details.plumbingJobType) return false;
  const resolved = resolvePlumbingJob(details.plumbingJobType, {
    activeLeak: details.activeLeak,
    waterShutoffAvailable: details.waterShutoffAvailable,
  });
  return resolved?.blocked ?? false;
}

export function minVerificationForPlumbingRoute(
  route: PlumbingWorkerRouteType
): VerificationLevel {
  if (route === "emergency_plumber") return "platinum";
  return "gold";
}

export function isPlumbingJobBlocked(job: PlumbingJobType): boolean {
  return job.bookingMode === "emergency_request" && !EMERGENCY_PLUMBING_AVAILABLE;
}

export function plumbingBookingModeLabel(mode: PlumbingBookingMode): string {
  switch (mode) {
    case "standard_repair_visit":
      return "Plumbing repair visit";
    case "inspection_only":
      return "Plumbing inspection";
    case "specialist_quote_request":
      return "Specialist plumbing request";
    case "emergency_request":
      return "Emergency plumbing";
  }
}

export function plumbingBookingModeDescription(mode: PlumbingBookingMode): string {
  switch (mode) {
    case "standard_repair_visit":
      return "For leaking taps, tap replacement, toilet cistern issues, shower heads, and simple drain blockages.";
    case "inspection_only":
      return "Not sure what is wrong? A plumber will assess the issue, advise on parts, and recommend the next step.";
    case "specialist_quote_request":
      return "This looks like a specialist job. Describe the issue in detail and add photos if you have them. TumaHelper will review and connect you with the right specialist.";
    case "emergency_request":
      return "This may require urgent assistance. If water is actively damaging your home, turn off the main water supply if safe to do so.";
  }
}

/** Job types shown in the classifier (hides unavailable emergency options). */
export function selectablePlumbingJobTypes(): PlumbingJobType[] {
  if (EMERGENCY_PLUMBING_AVAILABLE) return PLUMBING_JOB_TYPES;
  return PLUMBING_JOB_TYPES.filter((job) => job.bookingMode !== "emergency_request");
}
