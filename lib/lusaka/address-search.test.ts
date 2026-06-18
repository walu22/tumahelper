import { describe, expect, it } from "vitest";
import {
  areaSuggestionsToAddressSuggestions,
  mergeAddressSuggestions,
  type AddressSuggestion,
} from "./address-search";
import { searchLusakaPlaces } from "./places";

describe("mergeAddressSuggestions", () => {
  it("prefers street matches before area matches", () => {
    const streets: AddressSuggestion[] = [
      {
        id: "street-1",
        label: "Addis Ababa Drive, Rhodes Park",
        fillValue: "Addis Ababa Drive, Rhodes Park, Lusaka",
        source: "street",
      },
    ];
    const areas = areaSuggestionsToAddressSuggestions(searchLusakaPlaces("addis", 2));
    const merged = mergeAddressSuggestions(streets, areas);
    expect(merged[0]?.source).toBe("street");
  });
});
