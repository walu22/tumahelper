import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");
  const url = new URL("/dev-login", request.url);
  if (phone) url.searchParams.set("phone", phone);
  return NextResponse.redirect(url);
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Use /dev-login page instead" },
    { status: 410 }
  );
}
