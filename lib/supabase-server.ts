import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { isDevBypassEnabled } from '@/lib/auth/config'
import { getAdminClient } from '@/lib/supabase'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

/**
 * Server pages authenticated via app session (including dev login) may not have
 * a matching Supabase auth.uid(), so RLS would hide rows. When dev bypass is
 * active, use the service role and always filter by user id in the query.
 */
export function createAuthenticatedServerClient() {
  if (isDevBypassEnabled()) {
    return getAdminClient()
  }
  return createServerSupabaseClient()
}
