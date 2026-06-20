import type { HandymanServiceTypeId } from "@/lib/services/handyman-types";
import {
  getPlumbingJobType,
  isPlumbingService,
  minVerificationForPlumbingRoute,
  workerSkillsForPlumbingRoute,
} from "@/lib/services/handyman-plumbing";
import type { ServiceDetails } from "@/lib/services/catalog";
import type { VerificationLevel } from "@/types";

/** Worker skill tags used to match handyman booking types. */
export const HANDYMAN_WORKER_SKILLS = [
  "general_handyman",
  "plumbing",
  "general_plumber",
  "specialist_plumber",
  "drainage_sewer_specialist",
  "borehole_pump_technician",
  "emergency_plumber",
  "electrical",
  "mounting",
  "doors_cabinets",
  "wall_patch_paint",
  "furniture_assembly",
  "ac_fans",
  "tiling",
  "carpentry",
  "fence_gate",
  "home_maintenance",
  "welding",
] as const;

const SKILL_BY_TYPE: Record<HandymanServiceTypeId, string[]> = {
  general_handyman: ["general_handyman", "mounting", "doors_cabinets"],
  plumbing: ["plumbing"],
  electrical: ["electrical"],
  mounting: ["mounting", "general_handyman"],
  doors_cabinets: ["doors_cabinets", "carpentry", "general_handyman"],
  wall_patch_paint: ["wall_patch_paint", "general_handyman"],
  furniture_assembly: ["furniture_assembly", "general_handyman"],
  ac_fans: ["ac_fans", "electrical"],
  tiling: ["tiling"],
  carpentry: ["carpentry", "general_handyman"],
  fence_gate: ["fence_gate", "welding", "carpentry"],
  home_maintenance: ["home_maintenance", "general_handyman"],
};

/** Minimum verification for specialist handyman sub-types. */
const MIN_VERIFICATION: Partial<Record<HandymanServiceTypeId, VerificationLevel>> = {
  plumbing: "gold",
  electrical: "gold",
  ac_fans: "gold",
  fence_gate: "gold",
};

const VERIFICATION_RANK: VerificationLevel[] = [
  "none",
  "bronze",
  "silver",
  "gold",
  "platinum",
];

export function skillsForHandymanType(
  serviceType: string,
  details?: Pick<ServiceDetails, "plumbingJobType" | "routeToWorkerType">
): string[] {
  if (isPlumbingService(serviceType)) {
    if (details?.routeToWorkerType) {
      return workerSkillsForPlumbingRoute(details.routeToWorkerType);
    }
    const job = getPlumbingJobType(details?.plumbingJobType);
    if (job) return workerSkillsForPlumbingRoute(job.routeToWorkerType);
    return ["general_plumber", "plumbing"];
  }
  return SKILL_BY_TYPE[serviceType as HandymanServiceTypeId] ?? ["general_handyman"];
}

export function minVerificationForHandymanType(
  serviceType: string,
  details?: Pick<ServiceDetails, "plumbingJobType" | "routeToWorkerType">
): VerificationLevel | null {
  if (isPlumbingService(serviceType)) {
    if (details?.routeToWorkerType) {
      return minVerificationForPlumbingRoute(details.routeToWorkerType);
    }
    const job = getPlumbingJobType(details?.plumbingJobType);
    if (job) return minVerificationForPlumbingRoute(job.routeToWorkerType);
    return "gold";
  }
  return MIN_VERIFICATION[serviceType as HandymanServiceTypeId] ?? null;
}

export function workerMeetsHandymanVerification(
  workerLevel: VerificationLevel,
  serviceType: string,
  details?: Pick<ServiceDetails, "plumbingJobType" | "routeToWorkerType">
): boolean {
  const required = minVerificationForHandymanType(serviceType, details);
  if (!required) return true;
  return (
    VERIFICATION_RANK.indexOf(workerLevel) >= VERIFICATION_RANK.indexOf(required)
  );
}
