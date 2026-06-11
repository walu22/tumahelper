import type { SupabaseClient } from "@supabase/supabase-js";

export interface WorkerDisplay {
  full_name: string | null;
  profile_photo_url: string | null;
  phone: string | null;
}

/** Worker name/photo live on worker_profiles; phone on users. */
export async function fetchWorkerDisplay(
  supabase: SupabaseClient,
  workerUserId: string | null | undefined
): Promise<WorkerDisplay | null> {
  if (!workerUserId) return null;

  const [{ data: profile }, { data: user }] = await Promise.all([
    supabase
      .from("worker_profiles")
      .select("full_name, profile_photo_url")
      .eq("user_id", workerUserId)
      .maybeSingle(),
    supabase
      .from("users")
      .select("full_name, phone")
      .eq("id", workerUserId)
      .maybeSingle(),
  ]);

  return {
    full_name: profile?.full_name ?? user?.full_name ?? null,
    profile_photo_url: profile?.profile_photo_url ?? null,
    phone: user?.phone ?? null,
  };
}
