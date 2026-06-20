import type { WorkerCategory } from "@/types";

type WorkerProfileLike = {
  full_name?: string | null;
  area?: string | null;
  category?: WorkerCategory | string | null;
  skills?: string[] | null;
  verification_status?: string | null;
  employment_types?: string[] | null;
};

/** Workers must meet these before appearing in customer search. */
export function isWorkerSearchable(profile: WorkerProfileLike): boolean {
  if (profile.verification_status !== "approved") return false;
  if (!profile.full_name?.trim()) return false;
  if (!profile.area?.trim()) return false;
  if (!profile.category) return false;
  if (!Array.isArray(profile.skills) || profile.skills.length === 0) return false;
  if (!Array.isArray(profile.employment_types) || profile.employment_types.length === 0) {
    return false;
  }
  return true;
}
