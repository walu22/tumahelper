import { NextRequest } from "next/server";
import { getRouteHandlerClient } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/auth";
import { calculateTrustScore } from "@/lib/trust-score";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = getRouteHandlerClient();

    const { data: profile, error: profileError } = await supabase
      .from("worker_profiles")
      .select(`
        *,
        users!inner(id, status)
      `)
      .eq("id", id)
      .eq("users.status", "active")
      .single();

    if (profileError || !profile) {
      return errorResponse("NOT_FOUND", "Worker not found", 404);
    }

    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("worker_id", profile.user_id)
      .in("status", ["completed", "cancelled", "disputed"]);

    const { data: reviews } = await supabase
      .from("reviews")
      .select("*")
      .eq("reviewee_id", profile.user_id)
      .eq("is_visible", true);

    const { data: disputes } = await supabase
      .from("disputes")
      .select("*")
      .eq("against_user_id", profile.user_id)
      .eq("status", "resolved");

    const trustResult = calculateTrustScore(profile, bookings || [], reviews || [], disputes || []);

    const publicProfile = {
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
      trust_score_label: trustResult.label,
      trust_score_color: trustResult.color,
      is_provisional: trustResult.isProvisional,
      verification_level: profile.verification_level,
      average_rating: profile.average_rating,
      total_jobs_completed: profile.total_jobs_completed,
      total_reviews: profile.total_reviews,
      languages: profile.languages,
      skills: profile.skills,
      employment_types: profile.employment_types,
      availability_status: profile.availability_status,
      expected_salary_min: profile.expected_salary_min,
      expected_salary_max: profile.expected_salary_max,
    };

    return successResponse(publicProfile);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch worker", 500);
  }
}
