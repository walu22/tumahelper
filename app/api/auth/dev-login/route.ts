import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const ALLOWED_PHONES = [
  "+260961111111", "+260962222222", "+260963333333",
  "+260964444444", "+260965555555", "+260966666666",
  "+260967777777", "+260968888888", "+260969999999",
  "+260960000000",
  "+260976666666", "+260977777777", "+260978888888",
  "+260970000004", "+260970000005",
  "+260970000001",
]

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone || !ALLOWED_PHONES.includes(phone)) {
      return NextResponse.json({ success: false, error: "Invalid phone" }, { status: 400 })
    }

    const adminClient = getSupabaseServer()
    const { data: user, error: userError } = await adminClient
      .from("users")
      .select("id, role")
      .eq("phone", phone)
      .single()

    if (userError || !user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Set a dev password so we can sign in with phone + password
    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      user.id,
      { password: "dev123", phone_confirm: true }
    )

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
    }

    // Sign in with phone + password via the cookie-based client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
      phone,
      password: "dev123",
    })

    if (signInError) {
      return NextResponse.json({ success: false, error: signInError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { user: { id: user.id, role: user.role }, isNewUser: false },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
