import { describe, expect, it } from "vitest";
import {
  minVerificationForHandymanType,
  skillsForHandymanType,
  workerMeetsHandymanVerification,
} from "./handyman-skills";

describe("handyman skills", () => {
  it("maps plumbing to general plumber skills by default", () => {
    expect(skillsForHandymanType("plumbing")).toEqual(["general_plumber", "plumbing"]);
  });

  it("routes plumbing by job type", () => {
    expect(
      skillsForHandymanType("plumbing", {
        routeToWorkerType: "borehole_pump_technician",
      })
    ).toEqual(["borehole_pump_technician"]);
  });

  it("requires gold verification for borehole plumbing routes", () => {
    expect(
      minVerificationForHandymanType("plumbing", {
        routeToWorkerType: "borehole_pump_technician",
      })
    ).toBe("gold");
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
