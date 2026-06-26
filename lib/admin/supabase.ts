import { isAdminSupabaseConfigured } from "@/lib/admin/env";

export { isAdminSupabaseConfigured };

export function getAdminSupabaseClient() {
  if (!isAdminSupabaseConfigured()) return null;

  const { getSupabaseServer } = require("@/lib/supabase") as typeof import("@/lib/supabase");
  return getSupabaseServer();
}
