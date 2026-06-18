import { NextResponse } from "next/server";
import {
  areaSuggestionsToAddressSuggestions,
  fetchStreetSuggestions,
  mergeAddressSuggestions,
} from "@/lib/lusaka/address-search";
import { searchLusakaPlaces } from "@/lib/lusaka/places";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  const localAreas = areaSuggestionsToAddressSuggestions(searchLusakaPlaces(q, 4));

  if (q.length < 2) {
    return NextResponse.json({ suggestions: localAreas });
  }

  try {
    const streets = await fetchStreetSuggestions(q);
    const suggestions = mergeAddressSuggestions(streets, localAreas);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: localAreas });
  }
}
