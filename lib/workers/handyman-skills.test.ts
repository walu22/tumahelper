import { describe, expect, it } from "vitest";
import {
  minVerificationForHandymanType,
  skillsForHandymanType,
  workerMeetsHandymanVerification,
} from "./handyman-skills";

describe("handyman skills", () => {
  it("maps plumbing to plumbing skills", () => {
    expect(skillsForHandymanType("plumbing")).toEqual(["plumbing"]);
  });

  it("requires gold verification for electrical work", () => {
    expect(minVerificationForHandymanType("electrical")).toBe("gold");
    expect(workerMeetsHandymanVerification("silver", "electrical")).toBe(false);
    expect(workerMeetsHandymanVerification("gold", "electrical")).toBe(true);
  });

  it("allows general handyman without specialist verification", () => {
    expect(minVerificationForHandymanType("general_handyman")).toBeNull();
    expect(workerMeetsHandymanVerification("bronze", "general_handyman")).toBe(true);
  });
});
