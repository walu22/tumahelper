import { NextResponse } from "next/server";
import { reverseGeocodeCoordinates } from "@/lib/lusaka/address-search";
import { isWithinLusakaBbox } from "@/lib/lusaka/geolocation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number.parseFloat(searchParams.get("lat") ?? "");
  const lng = Number.parseFloat(searchParams.get("lon") ?? searchParams.get("lng") ?? "");

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  if (!isWithinLusakaBbox(lat, lng)) {
    return NextResponse.json(
      { error: "Location is outside the Lusaka service area" },
      { status: 400 }
    );
  }

  try {
    const result = await reverseGeocodeCoordinates(lat, lng);
    if (!result) {
      return NextResponse.json({ error: "Could not resolve address" }, { status: 404 });
    }
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Could not resolve address" }, { status: 500 });
  }
}
