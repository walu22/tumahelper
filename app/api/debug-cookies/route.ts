import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  
  return NextResponse.json({
    cookies: allCookies.map(c => ({ name: c.name, valueLength: c.value.length, valueStr: c.value.substring(0, 50) + "..." }))
  });
}
