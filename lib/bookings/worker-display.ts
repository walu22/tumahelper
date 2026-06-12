import type { SupabaseClient } from "@supabase/supabase-js";

export interface WorkerDisplay {
  profile_id: string | null;
  full_name: string | null;
  profile_photo_url: string | null;
  phone: string | null;
  availability_status: string | null;
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
      .select("id, full_name, profile_photo_url, availability_status")
      .eq("user_id", workerUserId)
      .maybeSingle(),
    supabase
      .from("users")
      .select("full_name, phone")
      .eq("id", workerUserId)
      .maybeSingle(),
  ]);

  return {
    profile_id: profile?.id ?? null,
    full_name: profile?.full_name ?? user?.full_name ?? null,
    profile_photo_url: profile?.profile_photo_url ?? null,
    phone: user?.phone ?? null,
    availability_status: profile?.availability_status ?? null,
  };
}
