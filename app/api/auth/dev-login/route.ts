import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const TEST_ACCOUNTS: Record<string, { role: string }> = {
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

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    const account = TEST_ACCOUNTS[phone]
    if (!account) {
      return NextResponse.json({ success: false, error: "Invalid phone number" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "")
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1]

    const adminClient = getSupabaseServer()

    // Find user in public.users table
    const { data: dbUser, error: dbError } = await adminClient
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single()

    if (dbError || !dbUser) {
      return NextResponse.json({ success: false, error: "User not found in database" }, { status: 404 })
    }

    // Check if auth user exists and set password
    let authUser
    try {
      const { data, error } = await adminClient.auth.admin.getUserById(dbUser.id)
      if (error || !data?.user) {
        // Auth user doesn't exist — create one
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          id: dbUser.id,
          phone,
          password: "dev123",
          phone_confirm: true,
          email: `${account.role}@tumahelper.dev`,
          email_confirm: true,
        })
        if (createError) throw new Error(`Create auth user failed: ${createError.message}`)
        authUser = newUser.user
      } else {
        // Auth user exists — update password and set email
        const { error: updateError } = await adminClient.auth.admin.updateUserById(dbUser.id, {
          password: "dev123",
          phone_confirm: true,
          email: `${account.role}@tumahelper.dev`,
          email_confirm: true,
        })
        if (updateError) throw new Error(`Update password failed: ${updateError.message}`)
        authUser = data.user
      }
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }

    // Call GoTrue token endpoint with email + password
    const gotrueUrl = `${supabaseUrl}/auth/v1`
    const signInRes = await fetch(`${gotrueUrl}/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": anonKey,
      },
      body: JSON.stringify({ email: `${account.role}@tumahelper.dev`, password: "dev123" }),
    })

    if (!signInRes.ok) {
      const errBody = await signInRes.text()
      return NextResponse.json({
        success: false,
        error: `Sign in failed (${signInRes.status}): ${errBody}`,
      }, { status: 500 })
    }

    const session = await signInRes.json()

    // Set the Supabase session cookie
    const cookieName = `sb-${projectRef}-auth-token`
    const cookieValue = JSON.stringify([session.access_token, session.refresh_token])

    const response = NextResponse.json({
      success: true,
      data: { user: { id: dbUser.id, role: account.role }, isNewUser: false },
    })

    response.cookies.set(cookieName, cookieValue, {
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
