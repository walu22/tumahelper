import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/auth";
import { workerMatchesSkills } from "@/lib/workers/skills";
import { isWorkerSearchable } from "@/lib/workers/eligibility";

/** When filtering by skills in memory, fetch enough candidates before slicing. */
const SKILLS_FILTER_FETCH_CAP = 500;

function mapPublicProfile(profile: Record<string, unknown>) {
  return {
    id: profile.id as string,
    user_id: profile.user_id as string,
    full_name: profile.full_name as string,
    city: profile.city as string,
    area: profile.area as string,
    location_lat:
      profile.location_lat != null ? Number(profile.location_lat) : null,
    location_lng:
      profile.location_lng != null ? Number(profile.location_lng) : null,
    bio: profile.bio as string | null,
    experience_years: profile.experience_years as number,
    category: profile.category as string,
    subcategory: profile.subcategory as string | null,
    profile_photo_url: profile.profile_photo_url as string | null,
    trust_score: profile.trust_score as number,
    verification_level: profile.verification_level as string,
    average_rating: profile.average_rating as number,
    total_jobs_completed: profile.total_jobs_completed as number,
    total_reviews: profile.total_reviews as number,
    languages: profile.languages as string[],
    skills: profile.skills as string[],
    employment_types: profile.employment_types as string[],
    availability_status: profile.availability_status as string,
    verification_status: profile.verification_status as string,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const area = searchParams.get("area");
    const verification = searchParams.get("verification");
    const minTrust = searchParams.get("minTrust");
    const available = searchParams.get("available");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skillsParam = searchParams.get("skills");
    const requiredSkills =
      skillsParam
        ?.split(",")
        .map((skill) => skill.trim())
        .filter(Boolean) ?? [];

    const supabase = getAdminClient();
    let query = supabase
      .from("worker_profiles")
      .select("*", { count: requiredSkills.length === 0 ? "exact" : undefined })
      .eq("verification_status", "approved");

    if (category) query = query.eq("category", category);
    if (city) query = query.eq("city", city);
    if (area) query = query.eq("area", area);
    if (verification) query = query.eq("verification_level", verification);
    if (minTrust) query = query.gte("trust_score", parseInt(minTrust));
    if (available === "true") query = query.eq("availability_status", "available");

    query = query
      .order("trust_score", { ascending: false })
      .order("is_featured", { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } =
      requiredSkills.length > 0
        ? await query.limit(SKILLS_FILTER_FETCH_CAP)
        : await query.range(from, to);

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    let publicProfiles = (data ?? []).map((profile) =>
      mapPublicProfile(profile as Record<string, unknown>)
    );

    if (requiredSkills.length > 0) {
      publicProfiles = publicProfiles.filter((profile) =>
        workerMatchesSkills(profile.skills as string[], requiredSkills)
      );
    }

    publicProfiles = publicProfiles.filter((profile) => isWorkerSearchable(profile));

    if (requiredSkills.length > 0) {
      const total = publicProfiles.length;
      const paged = publicProfiles.slice(from, from + limit);
      return successResponse(paged, {
        page,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      });
    }

    return successResponse(publicProfiles, {
      page,
      per_page: limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch workers", 500);
  }
}
