import { TrustScoreResult, WorkerProfile, Booking, Review, Dispute } from "@/types";

export function calculateTrustScore(
  profile: WorkerProfile,
  bookings: Booking[],
  reviews: Review[],
  disputes: Dispute[]
): TrustScoreResult {
  const verificationScores: Record<string, number> = {
    none: 0,
    bronze: 6,
    silver: 10,
    gold: 13,
    platinum: 15,
  };
  const identityVerification = verificationScores[profile.verification_level] || 0;

  const relevantBookings = bookings.filter((b) =>
    ["completed", "cancelled", "disputed", "no_show"].includes(b.status)
  );
  const completedJobs = relevantBookings.filter((b) => b.status === "completed").length;
  const totalRelevant = relevantBookings.length;
  const completionRate = totalRelevant > 0 ? completedJobs / totalRelevant : 0;
  const jobCompletion = Math.round(completionRate * 20);

  let weightedRatingSum = 0;
  let weightSum = 0;
  const now = new Date();

  reviews.forEach((review) => {
    const ageMonths =
      (now.getTime() - new Date(review.created_at).getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    let weight = 1;
    if (ageMonths > 24) weight = 0;
    else if (ageMonths > 12) weight = 0.4;
    else if (ageMonths > 6) weight = 0.7;

    weightedRatingSum += review.overall_rating * weight;
    weightSum += weight;
  });

  const avgRating = weightSum > 0 ? weightedRatingSum / weightSum : 0;
  const customerRating = Math.round((avgRating / 5) * 20);

  const punctualReviews = reviews.filter((r) => r.punctuality !== null);
  const avgPunctuality =
    punctualReviews.length > 0
      ? punctualReviews.reduce((sum, r) => sum + (r.punctuality || 0), 0) /
        punctualReviews.length
      : 0;
  const punctuality = Math.round((avgPunctuality / 5) * 10);

  const onTimeRate =
    punctualReviews.length > 0
      ? punctualReviews.filter((r) => (r.punctuality || 0) >= 4).length /
        punctualReviews.length
      : 0;
  const attendanceRate =
    totalRelevant > 0
      ? (totalRelevant - bookings.filter((b) => b.status === "no_show").length) /
        totalRelevant
      : 0;
  const reliability = Math.round((onTimeRate * 0.6 + attendanceRate * 0.4) * 15);

  let complaintHistory = 15;
  const workerDisputes = disputes.filter(
    (d) => d.against_user_id === profile.user_id && d.status === "resolved"
  );

  workerDisputes.forEach((d) => {
    switch (d.resolution_action) {
      case "account_ban":
        complaintHistory -= 15;
        break;
      case "worker_suspension":
        complaintHistory -= 10;
        break;
      case "partial_refund":
        complaintHistory -= 5;
        break;
      case "no_action":
        complaintHistory -= 2;
        break;
      default:
        complaintHistory -= 3;
    }
  });

  const monthsSinceLastDispute =
    workerDisputes.length > 0
      ? (now.getTime() -
          new Date(
            Math.max(
              ...workerDisputes.map((d) => new Date(d.resolved_at || 0).getTime())
            )
          ).getTime()) /
        (1000 * 60 * 60 * 24 * 30)
      : 999;

  if (monthsSinceLastDispute >= 1) {
    complaintHistory += Math.min(3, Math.floor(monthsSinceLastDispute));
  }

  complaintHistory = Math.max(0, Math.min(15, complaintHistory));

  const requiredFields = [
    profile.full_name,
    profile.city,
    profile.area,
    profile.bio,
    profile.profile_photo_url,
    profile.experience_years,
    profile.skills,
    profile.languages,
    profile.employment_types,
  ];
  const filledFields = requiredFields.filter(
    (f) => f && (typeof f !== "object" || (Array.isArray(f) && f.length > 0))
  ).length;
  const profileCompleteness = Math.round((filledFields / requiredFields.length) * 5);

  const total =
    identityVerification +
    jobCompletion +
    customerRating +
    punctuality +
    reliability +
    complaintHistory +
    profileCompleteness;

  const score = Math.min(100, total);
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const isProvisional = completedCount < 3 && profile.verification_level !== "platinum";

  let label: string;
  let color: string;

  if (isProvisional) {
    label = "New, building trust";
    color = "#9E9E9E";
  } else if (score >= 90) {
    label = "Exceptional";
    color = "#1B7A3F";
  } else if (score >= 75) {
    label = "Trusted";
    color = "#4CAF50";
  } else if (score >= 60) {
    label = "Good";
    color = "#FFC107";
  } else if (score >= 40) {
    label = "Fair";
    color = "#FF9800";
  } else {
    label = "Needs Improvement";
    color = "#F44336";
  }

  return {
    score,
    components: {
      identityVerification,
      jobCompletion,
      customerRating,
      punctuality,
      reliability,
      complaintHistory,
      profileCompleteness,
    },
    isProvisional,
    label,
    color,
  };
}

export function getTrustScoreLabel(score: number, isProvisional: boolean): { label: string; color: string } {
  if (isProvisional) return { label: "New, building trust", color: "#9E9E9E" };
  if (score >= 90) return { label: "Exceptional", color: "#1B7A3F" };
  if (score >= 75) return { label: "Trusted", color: "#4CAF50" };
  if (score >= 60) return { label: "Good", color: "#FFC107" };
  if (score >= 40) return { label: "Fair", color: "#FF9800" };
  return { label: "Needs Improvement", color: "#F44336" };
}

export async function recalculateTrustScore(userId: string, reason: string): Promise<void> {
  const { getAdminClient } = await import("@/lib/supabase");
  const adminClient = getAdminClient();

  const { data: profile } = await adminClient
    .from("worker_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) return;

  const { data: bookings } = await adminClient
    .from("bookings")
    .select("*")
    .eq("worker_id", userId);

  const { data: reviews } = await adminClient
    .from("reviews")
    .select("*")
    .eq("reviewee_id", userId);

  const { data: disputes } = await adminClient
    .from("disputes")
    .select("*")
    .eq("against_user_id", userId)
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
      average_rating: isNaN(avgRating) ? 0 : avgRating,
    })
    .eq("user_id", userId);
}
