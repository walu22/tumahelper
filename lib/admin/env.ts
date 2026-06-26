export function isAdminSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return Boolean(
    url &&
    serviceKey &&
    !url.includes("placeholder") &&
    !url.includes("your-project") &&
    !serviceKey.includes("placeholder")
  );
}
