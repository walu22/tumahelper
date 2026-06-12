import { NextRequest } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { createAuthenticatedRouteHandlerClient } from "@/lib/supabase-server";
import { requireAuth, successResponse, errorResponse } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";
import { calculateTrustScore } from "@/lib/trust-score";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const { id } = params;
    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const supabase = createAuthenticatedRouteHandlerClient();
    const adminClient = getAdminClient();

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (!booking) {
      return errorResponse("NOT_FOUND", "Booking not found", 404);
    }

    if (user.id !== booking.customer_id) {
      return errorResponse("FORBIDDEN", "Only customer can review", 403);
    }

    if (booking.status !== "completed") {
      return errorResponse("INVALID_STATUS", "Can only review completed bookings", 400);
    }

    if (booking.customer_rating) {
      return errorResponse("ALREADY_REVIEWED", "Booking already reviewed", 400);
    }

    const { data: review, error: reviewError } = await adminClient
      .from("reviews")
      .insert({
        booking_id: id,
        reviewer_id: user.id,
        reviewee_id: booking.worker_id,
        overall_rating: validated.overallRating,
        punctuality: validated.punctuality,
        quality: validated.quality,
        professionalism: validated.professionalism,
        communication: validated.communication,
        comment: validated.comment,
      })
      .select()
      .single();

    if (reviewError) {
      return errorResponse("CREATE_FAILED", reviewError.message, 500);
    }

    await adminClient
      .from("bookings")
      .update({
        customer_rating: validated.overallRating,
        customer_review: validated.comment,
      })
      .eq("id", id);

    const { data: profile } = await adminClient
      .from("worker_profiles")
      .select("*")
      .eq("user_id", booking.worker_id)
      .single();

    if (profile) {
      const { data: bookings } = await adminClient
        .from("bookings")
        .select("*")
        .eq("worker_id", booking.worker_id);

      const { data: reviews } = await adminClient
        .from("reviews")
        .select("*")
        .eq("reviewee_id", booking.worker_id);

      const { data: disputes } = await adminClient
        .from("disputes")
        .select("*")
        .eq("against_user_id", booking.worker_id)
        .eq("status", "resolved");

      const trustResult = calculateTrustScore(
        profile,
        bookings || [],
        reviews || [],
        disputes || []
      );

      const avgRating = (reviews || []).reduce((sum, r) => sum + r.overall_rating, 0) / (reviews || []).length;

      await adminClient
        .from("worker_profiles")
        .update({
          trust_score: trustResult.score,
          trust_score_components: trustResult.components,
          total_reviews: (reviews || []).length,
          average_rating: avgRating,
        })
        .eq("user_id", booking.worker_id);
    }

    return successResponse(review);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return errorResponse("VALIDATION_ERROR", "Invalid review data", 400);
    }
    return errorResponse("INTERNAL_ERROR", "Failed to submit review", 500);
  }
}
