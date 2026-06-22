import { buildBookAgainUrl } from "@/lib/bookings/book-again";
import {
  defaultServiceDetails,
  getAirbnbCleaningTypes,
  getCookingTypes,
  getGardenTypes,
  getHandymanTypes,
  getHousekeepingTypes,
  getLaundryTypes,
  getNannyTypes,
  getResidentialCleaningTypes,
  getServiceType,
  type ServiceCategoryKey,
  type ServiceDetails,
  type ServiceTypeOption,
} from "@/lib/services/catalog";
import type { PublicWorkerProfile } from "@/types";

const SKILL_LABELS: Record<string, string> = {
  infant_care: "Infant care",
  meal_prep: "Meal prep",
  homework_help: "Homework help",
  first_aid: "First aid",
  sleep_training: "Sleep training",
  newborn_care: "Newborn care",
  early_education: "Early education",
  deep_cleaning: "Deep cleaning",
  housekeeping: "Housekeeping",
  laundry: "Laundry",
  ironing: "Ironing",
  garden: "Garden work",
  airbnb_cleaning: "Short-stay cleaning",
  window_cleaning: "Window cleaning",
  organization: "Organising",
  cooking: "Cooking",
  general_handyman: "Handyman",
  plumbing: "Plumbing",
  general_plumber: "Plumbing",
  specialist_plumber: "Plumbing",
  drainage_sewer_specialist: "Drainage",
  borehole_pump_technician: "Borehole pumps",
  emergency_plumber: "Emergency plumbing",
  electrical: "Electrical",
  mounting: "Mounting",
  doors_cabinets: "Doors and cabinets",
  wall_patch_paint: "Wall repairs",
  furniture_assembly: "Furniture assembly",
  ac_fans: "AC and fans",
  tiling: "Tiling",
  carpentry: "Carpentry",
  fence_gate: "Fencing",
  home_maintenance: "Home maintenance",
  welding: "Welding",
};

const SKILL_TO_CATEGORY: Record<string, ServiceCategoryKey> = {
  airbnb_cleaning: "cleaning",
  deep_cleaning: "cleaning",
  window_cleaning: "cleaning",
  organization: "cleaning",
  housekeeping: "housekeeping",
  meal_prep: "cooking",
  cooking: "cooking",
  laundry: "laundry",
  ironing: "laundry",
  garden: "garden",
  general_handyman: "handyman",
  plumbing: "handyman",
  general_plumber: "handyman",
  specialist_plumber: "handyman",
  drainage_sewer_specialist: "handyman",
  borehole_pump_technician: "handyman",
  emergency_plumber: "handyman",
  electrical: "handyman",
  mounting: "handyman",
  doors_cabinets: "handyman",
  wall_patch_paint: "handyman",
  furniture_assembly: "handyman",
  ac_fans: "handyman",
  tiling: "handyman",
  carpentry: "handyman",
  fence_gate: "handyman",
  home_maintenance: "handyman",
  welding: "handyman",
};

function typesForCategory(category: ServiceCategoryKey): ServiceTypeOption[] {
  switch (category) {
    case "nanny":
      return getNannyTypes();
    case "cleaning":
      return getResidentialCleaningTypes();
    case "housekeeping":
      return getHousekeepingTypes();
    case "cooking":
      return getCookingTypes();
    case "laundry":
      return getLaundryTypes();
    case "garden":
      return getGardenTypes();
    case "handyman":
      return getHandymanTypes();
  }
}

function fallbackSkillLabel(skill: string): string {
  return skill
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function detailsFromType(category: ServiceCategoryKey, type: ServiceTypeOption): ServiceDetails {
  return {
    ...defaultServiceDetails(category),
    serviceType: type.id,
    durationHours: type.defaultHours,
  };
}

export function inferWorkerServiceDetails(worker: PublicWorkerProfile): ServiceDetails {
  if (worker.category === "nanny") {
    const type = getNannyTypes()[0];
    if (!type) return defaultServiceDetails("nanny");
    return detailsFromType("nanny", type);
  }

  for (const skill of worker.skills ?? []) {
    if (skill === "airbnb_cleaning") {
      const type = getAirbnbCleaningTypes()[0];
      if (type) return detailsFromType("cleaning", type);
    }

    const category = SKILL_TO_CATEGORY[skill];
    if (!category) continue;

    const type = typesForCategory(category)[0];
    if (!type) continue;

    return detailsFromType(category, type);
  }

  const type = getResidentialCleaningTypes()[0];
  if (!type) return defaultServiceDetails("cleaning");
  return detailsFromType("cleaning", type);
}

export function buildWorkerSpotlightBookUrl(worker: PublicWorkerProfile): string {
  return buildBookAgainUrl(worker.id, inferWorkerServiceDetails(worker));
}

export function getWorkerStartingPriceLabel(worker: PublicWorkerProfile): string | null {
  const details = inferWorkerServiceDetails(worker);
  const type = getServiceType(details.category, details.serviceType);
  if (!type) return null;
  return `From K${type.priceHintMin}`;
}

export function getWorkerSpotlightStatusLine(worker: PublicWorkerProfile): string {
  if (worker.total_jobs_completed > 0) {
    const count = worker.total_jobs_completed;
    return count === 1 ? "Booked 1 time" : `Booked ${count} times`;
  }

  if (worker.availability_status === "available") {
    return "Available tomorrow";
  }

  if (worker.availability_status === "busy") {
    return "Fully booked";
  }

  return "Not available right now";
}

export function getWorkerSkillLabels(worker: PublicWorkerProfile, limit = 4): string[] {
  const skills = worker.skills ?? [];
  if (skills.length > 0) {
    return skills
      .slice(0, limit)
      .map((skill) => SKILL_LABELS[skill] ?? fallbackSkillLabel(skill));
  }

  return worker.category === "nanny" ? ["Nanny"] : ["House cleaning"];
}
