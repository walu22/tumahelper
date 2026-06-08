import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const EMAIL_ROLE_MAP: Record<string, string> = {
  "admin@tumahelper.dev": "admin",
  "worker@tumahelper.dev": "worker",
  "customer@tumahelper.dev": "customer",
}

const ROLE_REDIRECTS: Record<string, string> = {
  customer: "/customer/dashboard",
  worker: "/worker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin",
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    const role = EMAIL_ROLE_MAP[email]
    if (!role) {
      return NextResponse.json({ success: false, error: "Unknown account. Use admin@tumahelper.dev, worker@tumahelper.dev, or customer@tumahelper.dev" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "")
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1]

    const adminClient = getSupabaseServer()

    // Find any user with this role in the users table
    const { data: user } = await adminClient
      .from("users")
      .select("id, role")
      .eq("role", role)
      .limit(1)
      .single()

    if (!user) {
      return NextResponse.json({ success: false, error: `No ${role} user found in database` }, { status: 404 })
    }

    // Update auth user with this email + password
    const { data: existing } = await adminClient.auth.admin.getUserById(user.id)
    if (!existing?.user) {
      await adminClient.auth.admin.createUser({
        id: user.id,
        email,
        password,
        email_confirm: true,
      })
    } else {
      await adminClient.auth.admin.updateUserById(user.id, { email, password, email_confirm: true })
    }

    // Also update email in public.users
    await adminClient.from("users").update({ email }).eq("id", user.id)

    // Sign in via GoTrue API with email + password
    const signInRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: anonKey },
      body: JSON.stringify({ email, password }),
    })

    if (!signInRes.ok) {
      const err = await signInRes.text()
      return NextResponse.json({ success: false, error: `Sign in failed: ${err}` }, { status: 500 })
    }

    const session = await signInRes.json()

    const redirect = ROLE_REDIRECTS[role] || "/dashboard"

    const response = NextResponse.json({
      success: true,
      data: { redirect, user: { id: user.id, role } },
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
