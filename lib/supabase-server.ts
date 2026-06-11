import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { DEV_SESSION_COOKIE, isDevBypassEnabled } from '@/lib/auth/config'
import { getAdminClient } from '@/lib/supabase'

function isDevSessionActive() {
  const value = cookies().get(DEV_SESSION_COOKIE)?.value
  if (!value) return false

  try {
    const payload = JSON.parse(
      Buffer.from(value, 'base64url').toString('utf8')
    ) as { id?: string; exp?: number }
    return Boolean(payload?.id && payload.exp && payload.exp > Date.now())
  } catch {
    return false
  }
}

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
  if (isDevBypassEnabled() || isDevSessionActive()) {
    return getAdminClient()
  }
  return createServerSupabaseClient()
}
