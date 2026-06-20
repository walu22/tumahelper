import { describe, expect, it } from "vitest";
import {
  skillsForServiceCategory,
  workerMatchesSkills,
} from "./skills";

describe("worker skills matching", () => {
  it("returns cooking skills for cooking bookings", () => {
    expect(skillsForServiceCategory("cooking")).toEqual(["cooking", "meal_prep"]);
  });

  it("returns laundry skills for laundry bookings", () => {
    expect(skillsForServiceCategory("laundry")).toEqual(["laundry", "ironing"]);
  });

  it("returns garden skills for garden bookings", () => {
    expect(skillsForServiceCategory("garden")).toEqual(["garden"]);
  });

  it("returns short-stay skills for airbnb cleaning types", () => {
    expect(skillsForServiceCategory("cleaning", "guest_checkout")).toEqual([
      "airbnb_cleaning",
      "deep_cleaning",
    ]);
  });

  it("matches when worker has any required skill", () => {
    expect(workerMatchesSkills(["laundry", "meal_prep"], ["garden", "laundry"])).toBe(
      true
    );
    expect(workerMatchesSkills(["deep_cleaning"], ["garden", "laundry"])).toBe(false);
  });

  it("matches all workers when no skills are required", () => {
    expect(workerMatchesSkills([], [])).toBe(true);
  });
});
