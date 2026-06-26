import { getAdminSupabaseClient } from "@/lib/admin/supabase";

export type AdminWorkerDetail = {
  id: string;
  user_id: string;
  full_name: string;
  city: string;
  area: string;
  bio: string | null;
  experience_years: number;
  category: string;
  subcategory: string | null;
  verification_level: string;
  verification_status: string;
  trust_score: number;
  trust_score_components: Record<string, number> | null;
  availability_status: string;
  total_jobs_completed: number;
  total_reviews: number;
  average_rating: number;
  is_featured: boolean;
  created_at: string;
};

export async function getAdminWorkerDetail(id: string): Promise<AdminWorkerDetail | null> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return null;

  try {
    const { data } = await supabase
      .from("worker_profiles")
      .select(
        "id, user_id, full_name, city, area, bio, experience_years, category, subcategory, verification_level, verification_status, trust_score, trust_score_components, availability_status, total_jobs_completed, total_reviews, average_rating, is_featured, created_at"
      )
      .eq("id", id)
      .single();

    return (data as AdminWorkerDetail | null) ?? null;
  } catch {
    return null;
  }
}
