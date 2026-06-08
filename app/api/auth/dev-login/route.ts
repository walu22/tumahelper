import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

const TEST_ACCOUNTS: Record<string, { email: string; role: string }> = {
  "+260961111111": { email: "worker1@tumahelper.dev", role: "worker" },
  "+260962222222": { email: "worker2@tumahelper.dev", role: "worker" },
  "+260963333333": { email: "worker3@tumahelper.dev", role: "worker" },
  "+260964444444": { email: "worker4@tumahelper.dev", role: "worker" },
  "+260965555555": { email: "worker5@tumahelper.dev", role: "worker" },
  "+260966666666": { email: "worker6@tumahelper.dev", role: "worker" },
  "+260967777777": { email: "worker7@tumahelper.dev", role: "worker" },
  "+260968888888": { email: "worker8@tumahelper.dev", role: "worker" },
  "+260969999999": { email: "worker9@tumahelper.dev", role: "worker" },
  "+260960000000": { email: "worker10@tumahelper.dev", role: "worker" },
  "+260976666666": { email: "customer1@tumahelper.dev", role: "customer" },
  "+260977777777": { email: "customer2@tumahelper.dev", role: "customer" },
  "+260978888888": { email: "customer3@tumahelper.dev", role: "customer" },
  "+260970000004": { email: "customer4@tumahelper.dev", role: "customer" },
  "+260970000005": { email: "customer5@tumahelper.dev", role: "customer" },
  "+260970000001": { email: "admin@tumahelper.dev", role: "admin" },
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    const account = TEST_ACCOUNTS[phone]
    if (!account) {
      return NextResponse.json({ success: false, error: "Invalid phone" }, { status: 400 })
    }

    const adminClient = getSupabaseServer()
    const { data: user, error: userError } = await adminClient
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: "User not found in database" }, { status: 404 })
    }

    // Set email + password on the auth user
    const { error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
      email: account.email,
      password: "dev123",
      email_confirm: true,
    })

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
    }

    // Update email in public.users table too
    await adminClient.from("users").update({ email: account.email }).eq("id", user.id)

    // Call GoTrue API directly to sign in with email+password and get session tokens
    const gotrueUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "") + "/auth/v1"
    const signInRes = await fetch(`${gotrueUrl}/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({ email: account.email, password: "dev123" }),
    })

    if (!signInRes.ok) {
      const errText = await signInRes.text()
      return NextResponse.json({ success: false, error: `Sign in failed: ${errText}` }, { status: 500 })
    }

    const session = await signInRes.json()

    // Set Supabase session cookies on the response
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.match(/https:\/\/(.+)\.supabase\.co/)?.[1]
    const cookieName = `sb-${projectRef}-auth-token`

    const response = NextResponse.json({
      success: true,
      data: { user: { id: user.id, role: account.role }, isNewUser: false },
    })

    response.cookies.set(cookieName, JSON.stringify([session.access_token, session.refresh_token]), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    return response
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
