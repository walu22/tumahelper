import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase"

const ACCOUNTS: Record<string, { role: string }> = {
  "+260961111111": { role: "worker" },
  "+260976666666": { role: "customer" },
  "+260970000001": { role: "admin" },
}

export default async function DevLoginPage({
  searchParams,
}: {
  searchParams: { phone?: string }
}) {
  const phone = searchParams.phone

  if (!phone || !ACCOUNTS[phone]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
          <h1 className="text-xl font-bold mb-4">Dev Login</h1>
          <p className="text-sm text-muted-foreground mb-4">Click a user to log in instantly:</p>
          <div className="space-y-2">
            <a href="/dev-login?phone=%2B260961111111" className="block p-3 border rounded-lg hover:bg-gray-50">
              <span className="font-medium">Worker</span>
              <span className="text-xs text-muted-foreground ml-2">+260961111111</span>
            </a>
            <a href="/dev-login?phone=%2B260976666666" className="block p-3 border rounded-lg hover:bg-gray-50">
              <span className="font-medium">Customer</span>
              <span className="text-xs text-muted-foreground ml-2">+260976666666</span>
            </a>
            <a href="/dev-login?phone=%2B260970000001" className="block p-3 border rounded-lg hover:bg-gray-50">
              <span className="font-medium">Admin</span>
              <span className="text-xs text-muted-foreground ml-2">+260970000001</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  const account = ACCOUNTS[phone]
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "")
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1]

  const adminClient = getSupabaseServer()
  const { data: dbUser } = await adminClient
    .from("users")
    .select("id")
    .eq("phone", phone)
    .single()

  if (!dbUser) {
    return <div className="p-8">User not found in database</div>
  }

  // Create or update auth user with password
  const { data: existing } = await adminClient.auth.admin.getUserById(dbUser.id)
  if (!existing?.user) {
    await adminClient.auth.admin.createUser({
      id: dbUser.id,
      phone,
      password: "dev123",
      phone_confirm: true,
      email: `${account.role}@tumahelper.dev`,
      email_confirm: true,
    })
  } else {
    await adminClient.auth.admin.updateUserById(dbUser.id, { password: "dev123", phone_confirm: true })
  }

  // Sign in via GoTrue API and set cookie
  const signInRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anonKey },
    body: JSON.stringify({ phone, password: "dev123" }),
  })

  if (!signInRes.ok) {
    const err = await signInRes.text()
    return <div className="p-8">Sign in failed: {err}</div>
  }

  const session = await signInRes.json()

  // Set cookie and redirect using the server component client
  const cookieStore = cookies()
  cookieStore.set(`sb-${projectRef}-auth-token`, JSON.stringify([session.access_token, session.refresh_token]), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  })

  const redirects: Record<string, string> = {
    worker: "/worker/bookings",
    customer: "/customer/bookings",
    admin: "/admin",
  }

  redirect(redirects[account.role] || "/dashboard")
}
