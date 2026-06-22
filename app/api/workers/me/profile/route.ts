import { NextRequest } from "next/server";
import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import { requireRole, successResponse, errorResponse } from "@/lib/auth";
import { workerProfileSchema } from "@/lib/validations";
import { encrypt } from "@/lib/encryption";
import { resolveWorkerStorageCoords } from "@/lib/workers/location";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("worker");
    const body = await request.json();
    const validated = workerProfileSchema.parse(body);

    const coords = resolveWorkerStorageCoords({
      area: validated.area,
      city: validated.city,
      locationLat: validated.locationLat ?? body.locationLat,
      locationLng: validated.locationLng ?? body.locationLng,
    });

    const supabase = getRouteHandlerClient();
    const adminClient = getAdminClient();

    let encryptedNrc = null;
    if (body.nrcNumber) {
      encryptedNrc = encrypt(body.nrcNumber);
    }

    const profileData = {
      user_id: user.id,
      full_name: validated.fullName,
      nrc_number: encryptedNrc,
      date_of_birth: validated.dateOfBirth,
      gender: validated.gender,
      city: validated.city,
      area: validated.area,
      location_lat: coords?.lat ?? null,
      location_lng: coords?.lng ?? null,
      bio: validated.bio,
      experience_years: validated.experienceYears,
      expected_salary_min: validated.expectedSalaryMin,
      expected_salary_max: validated.expectedSalaryMax,
      availability_status: validated.availabilityStatus,
      employment_types: validated.employmentTypes,
      languages: validated.languages,
      skills: validated.skills,
      category: validated.category,
      subcategory: validated.subcategory,
      verification_level: "bronze",
      verification_status: "not_submitted",
    };

    const { data, error } = await adminClient
      .from("worker_profiles")
      .upsert(profileData, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      return errorResponse("SAVE_FAILED", error.message, 500);
    }

    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid profile data", 400);
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return errorResponse("FORBIDDEN", "Worker access required", 403);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to save profile", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole("worker");
    const supabase = getRouteHandlerClient();

    const { data, error } = await supabase
      .from("worker_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch profile", 500);
  }
}
