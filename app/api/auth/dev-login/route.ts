import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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

    // Also update the public.users table with the email
    await adminClient.from("users").update({ email: account.email }).eq("id", user.id)

    // Sign in with email + password
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: "dev123",
    })

    if (signInError) {
      return NextResponse.json({ success: false, error: signInError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { user: { id: user.id, role: account.role }, isNewUser: false },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
