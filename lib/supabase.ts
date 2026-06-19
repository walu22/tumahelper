import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  createRouteHandlerClient,
  createServerComponentClient,
  createServerActionClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const serviceAuth = {
  autoRefreshToken: false,
  persistSession: false,
} as const;

function requireSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("supabaseUrl is required.");
  return url;
}

function requireAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required.");
  return key;
}

function requireServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");
  return key;
}

let serviceClient: SupabaseClient | null = null;

export function getServerClient(): SupabaseClient {
  if (!serviceClient) {
    serviceClient = createClient(requireSupabaseUrl(), requireServiceKey(), {
      auth: serviceAuth,
    });
  }
  return serviceClient;
}

export const getSupabaseServer = getServerClient;

export function getRouteHandlerClient() {
  const cookieStore = cookies();
  return createRouteHandlerClient({ cookies: () => cookieStore });
}

export const getSupabaseRouteHandler = getRouteHandlerClient;

export function getServerActionClient() {
  const cookieStore = cookies();
  return createServerActionClient({ cookies: () => cookieStore });
}

export function getServerComponentClient() {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
}

export function getAdminClient(): SupabaseClient {
  return getServerClient();
}

let anonClient: SupabaseClient | null = null;

/** Server-side anon client (rare); prefer getServerClient for app data. */
export function getAnonClient(): SupabaseClient {
  if (!anonClient) {
    anonClient = createClient(requireSupabaseUrl(), requireAnonKey());
  }
  return anonClient;
}
