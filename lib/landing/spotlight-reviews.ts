import type { PublicWorkerProfile } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type ReviewPick = {
  reviewee_id: string;
  comment: string | null;
  overall_rating: number;
};

export async function getSpotlightReviewQuotes(
  supabase: SupabaseClient,
  workers: PublicWorkerProfile[]
): Promise<Record<string, string>> {
  const userIds = workers.map((worker) => worker.user_id);
  if (userIds.length === 0) return {};

  const { data } = await supabase
    .from("reviews")
    .select("reviewee_id, comment, overall_rating, created_at")
    .in("reviewee_id", userIds)
    .eq("is_visible", true)
    .not("comment", "is", null)
    .order("overall_rating", { ascending: false })
    .order("created_at", { ascending: false });

  const quotes: Record<string, string> = {};
  for (const review of (data as ReviewPick[] | null) ?? []) {
    const comment = review.comment?.trim();
    if (!comment || quotes[review.reviewee_id]) continue;
    quotes[review.reviewee_id] = comment;
  }

  return quotes;
}
