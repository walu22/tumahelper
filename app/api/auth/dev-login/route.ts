import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const ACCOUNTS: Record<string, { role: string }> = {
  "+260961111111": { role: "worker" },
  "+260962222222": { role: "worker" },
  "+260963333333": { role: "worker" },
  "+260964444444": { role: "worker" },
  "+260965555555": { role: "worker" },
  "+260966666666": { role: "worker" },
  "+260967777777": { role: "worker" },
  "+260968888888": { role: "worker" },
  "+260969999999": { role: "worker" },
  "+260960000000": { role: "worker" },
  "+260976666666": { role: "customer" },
  "+260977777777": { role: "customer" },
  "+260978888888": { role: "customer" },
  "+260970000004": { role: "customer" },
  "+260970000005": { role: "customer" },
  "+260970000001": { role: "admin" },
}

const REDIRECTS: Record<string, string> = {
  worker: "/worker/bookings",
  customer: "/customer/bookings",
  admin: "/admin",
}

async function loginAndRedirect(phone: string) {
  const account = ACCOUNTS[phone]
  if (!account) {
    return NextResponse.redirect(new URL("/dev-login?error=invalid", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
  }

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
    return NextResponse.redirect(new URL("/dev-login?error=notfound", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
  }

  const email = `${account.role}@tumahelper.dev`

  // Create or update auth user
  const { data: existing } = await adminClient.auth.admin.getUserById(dbUser.id)
  if (!existing?.user) {
    await adminClient.auth.admin.createUser({
      id: dbUser.id,
      phone,
      password: "dev123",
      phone_confirm: true,
      email,
      email_confirm: true,
    })
  } else {
    await adminClient.auth.admin.updateUserById(dbUser.id, { password: "dev123", phone_confirm: true, email, email_confirm: true })
  }

  // Sign in via GoTrue API with email + password
  const signInRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: anonKey },
    body: JSON.stringify({ email, password: "dev123" }),
  })

  if (!signInRes.ok) {
    const err = await signInRes.text()
    return NextResponse.redirect(new URL(`/dev-login?error=${encodeURIComponent(err)}`, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
  }

  const session = await signInRes.json()

  // Set cookie and redirect
  const response = NextResponse.redirect(new URL(REDIRECTS[account.role] || "/dashboard", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))

  response.cookies.set(`sb-${projectRef}-auth-token`, JSON.stringify([session.access_token, session.refresh_token]), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone")
  if (!phone) {
    return NextResponse.redirect(new URL("/dev-login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
  }
  return loginAndRedirect(phone)
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    if (!phone || !ACCOUNTS[phone]) {
      return NextResponse.json({ success: false, error: "Invalid phone" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "")
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1]

    const adminClient = getSupabaseServer()
    const { data: dbUser } = await adminClient.from("users").select("id").eq("phone", phone).single()
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const account = ACCOUNTS[phone]
    const email = `${account.role}@tumahelper.dev`

    const { data: existing } = await adminClient.auth.admin.getUserById(dbUser.id)
    if (!existing?.user) {
      await adminClient.auth.admin.createUser({ id: dbUser.id, phone, password: "dev123", phone_confirm: true, email, email_confirm: true })
    } else {
      await adminClient.auth.admin.updateUserById(dbUser.id, { password: "dev123", phone_confirm: true, email, email_confirm: true })
    }

    const signInRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: anonKey },
      body: JSON.stringify({ email, password: "dev123" }),
    })

    if (!signInRes.ok) {
      const err = await signInRes.text()
      return NextResponse.json({ success: false, error: `Sign in failed: ${err}` }, { status: 500 })
    }

    const session = await signInRes.json()

    const response = NextResponse.json({
      success: true,
      data: { user: { id: dbUser.id, role: account.role }, isNewUser: false },
    })

    response.cookies.set(`sb-${projectRef}-auth-token`, JSON.stringify([session.access_token, session.refresh_token]), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    })

    return response
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
