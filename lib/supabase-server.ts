import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getAdminClient } from '@/lib/supabase'

function hasRealServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  return Boolean(key && !key.includes('your-') && !key.includes('placeholder'))
}

/**
 * App auth (getCurrentUser / requireAuth) can resolve a user while Supabase
 * auth.uid() is missing or out of sync in server components — RLS then hides
 * rows and booking pages 404. Use the service role whenever it is configured
 * and always scope queries by the authenticated user id in application code.
 */
function shouldUseAdminClientForAppAuth() {
  return hasRealServiceRoleKey()
}

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

/**
 * Server pages and route handlers authenticated via getCurrentUser / requireAuth.
 * Uses the service role when configured; callers must filter by user id in queries.
 */
export function createAuthenticatedServerClient() {
  if (shouldUseAdminClientForAppAuth()) {
    return getAdminClient()
  }
  return createServerSupabaseClient()
}

/**
 * Route handlers share the same app-auth vs Supabase-auth split as server pages.
 * Use this for booking mutations/reads after requireAuth() and explicit user checks.
 */
export function createAuthenticatedRouteHandlerClient() {
  if (shouldUseAdminClientForAppAuth()) {
    return getAdminClient()
  }
  const cookieStore = cookies()
  return createRouteHandlerClient({ cookies: () => cookieStore })
}
