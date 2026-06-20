import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/auth";
import { workerMatchesSkills } from "@/lib/workers/skills";

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

    // Service role: public worker browse must not join `users` via anon RLS (returns empty).
    const supabase = getAdminClient();
    let query = supabase
      .from("worker_profiles")
      .select("*", { count: "exact" })
      .eq("verification_status", "approved");

    if (category) query = query.eq("category", category);
    if (city) query = query.eq("city", city);
    if (area) query = query.eq("area", area);
    if (verification) query = query.eq("verification_level", verification);
    if (minTrust) query = query.gte("trust_score", parseInt(minTrust));
    if (available === "true") query = query.eq("availability_status", "available");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order("trust_score", { ascending: false })
      .order("is_featured", { ascending: false })
      .range(from, to);

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    let publicProfiles = data?.map((profile) => ({
      id: profile.id,
      user_id: profile.user_id,
      full_name: profile.full_name,
      city: profile.city,
      area: profile.area,
      bio: profile.bio,
      experience_years: profile.experience_years,
      category: profile.category,
      subcategory: profile.subcategory,
      profile_photo_url: profile.profile_photo_url,
      trust_score: profile.trust_score,
      verification_level: profile.verification_level,
      average_rating: profile.average_rating,
      total_jobs_completed: profile.total_jobs_completed,
      total_reviews: profile.total_reviews,
      languages: profile.languages,
      skills: profile.skills,
      employment_types: profile.employment_types,
      availability_status: profile.availability_status,
    }));

    if (requiredSkills.length > 0) {
      publicProfiles = publicProfiles?.filter((profile) =>
        workerMatchesSkills(profile.skills as string[], requiredSkills)
      );
    }

    return successResponse(publicProfiles || [], {
      page,
      per_page: limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch workers", 500);
  }
}
