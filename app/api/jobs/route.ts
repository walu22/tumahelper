import { NextRequest } from "next/server";
import { getRouteHandlerClient, getAdminClient } from "@/lib/supabase";
import { requireAuth, requireRole, successResponse, errorResponse } from "@/lib/auth";
import { jobPostSchema } from "@/lib/validations";
import { calculatePlacementFee } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("employer");
    const body = await request.json();
    const validated = jobPostSchema.parse(body);

    const adminClient = getAdminClient();

    const placementFee = calculatePlacementFee(validated.salaryMin || 0);

    const { data, error } = await adminClient
      .from("job_posts")
      .insert({
        employer_id: user.id,
        title: validated.title,
        category: validated.category,
        location: validated.location,
        city: validated.city,
        salary_min: validated.salaryMin,
        salary_max: validated.salaryMax,
        employment_type: validated.employmentType,
        working_hours: validated.workingHours,
        required_experience_years: validated.requiredExperienceYears,
        required_verification_level: validated.requiredVerificationLevel,
        required_skills: validated.requiredSkills,
        description: validated.description,
        requirements: validated.requirements,
        benefits: validated.benefits,
        placement_fee: placementFee,
      })
      .select()
      .single();

    if (error) {
      return errorResponse("CREATE_FAILED", error.message, 500);
    }

    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid job data", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to create job", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const employmentType = searchParams.get("employmentType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const supabase = getRouteHandlerClient();

    let query = supabase
      .from("job_posts")
      .select(`
        *,
        employer:employer_id(full_name)
      `)
      .eq("status", "open");

    if (category) query = query.eq("category", category);
    if (city) query = query.eq("city", city);
    if (employmentType) query = query.eq("employment_type", employmentType);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return errorResponse("FETCH_FAILED", error.message, 500);
    }

    return successResponse(data || [], {
      page,
      per_page: limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch jobs", 500);
  }
}
