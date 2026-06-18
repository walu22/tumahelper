import { describe, expect, it } from "vitest";
import {
  AIRBNB_SCOPE_NOT_INCLUDED,
  AIRBNB_SCOPE_PITCH,
  AIRBNB_SCOPE_SECTIONS,
} from "./airbnb-scope";

describe("airbnb scope content", () => {
  it("defines room-by-room sections for the slide-over panel", () => {
    expect(AIRBNB_SCOPE_PITCH.length).toBeGreaterThan(40);
    expect(AIRBNB_SCOPE_SECTIONS.map((section) => section.title)).toEqual([
      "Living room",
      "Kitchen",
      "Bedrooms",
      "Bathrooms",
      "Extras",
    ]);
    expect(AIRBNB_SCOPE_NOT_INCLUDED.length).toBeGreaterThan(0);
  });
});
