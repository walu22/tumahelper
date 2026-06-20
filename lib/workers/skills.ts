import type { ServiceCategoryKey } from "@/lib/services/catalog";
import { isAirbnbCleaningType } from "@/lib/services/catalog";
import type { WorkerCategory } from "@/types";

export const NANNY_SKILLS = [
  "infant_care",
  "meal_prep",
  "homework_help",
  "first_aid",
  "sleep_training",
  "newborn_care",
  "early_education",
] as const;

export const HOUSE_CLEANER_SKILLS = [
  "deep_cleaning",
  "housekeeping",
  "laundry",
  "ironing",
  "garden",
  "airbnb_cleaning",
  "window_cleaning",
  "organization",
  "meal_prep",
] as const;

export const WORKER_SKILLS_BY_CATEGORY: Record<WorkerCategory, readonly string[]> = {
  nanny: NANNY_SKILLS,
  house_cleaner: HOUSE_CLEANER_SKILLS,
};

/** Skills used to match workers when a customer books a service. */
export function skillsForServiceCategory(
  category: ServiceCategoryKey,
  serviceType?: string
): string[] {
  if (category === "nanny") return [];

  if (category === "cleaning" && serviceType && isAirbnbCleaningType(serviceType)) {
    return ["airbnb_cleaning", "deep_cleaning"];
  }

  switch (category) {
    case "cleaning":
      return ["deep_cleaning", "window_cleaning", "organization"];
    case "housekeeping":
      return ["housekeeping", "meal_prep", "laundry", "ironing"];
    case "laundry":
      return ["laundry", "ironing"];
    case "garden":
      return ["garden"];
    default:
      return [];
  }
}

export function workerMatchesSkills(
  workerSkills: string[] | null | undefined,
  requiredSkills: string[]
): boolean {
  if (requiredSkills.length === 0) return true;
  const skills = workerSkills ?? [];
  return requiredSkills.some((skill) => skills.includes(skill));
}
