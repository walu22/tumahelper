import { describe, expect, it } from "vitest";
import {
  applyPlumbingJobToDetails,
  getPlumbingJobType,
  isPlumbingBookingBlocked,
  resolvePlumbingJob,
  selectablePlumbingJobTypes,
  workerSkillsForPlumbingRoute,
} from "./handyman-plumbing";
import { defaultServiceDetails } from "./catalog";

describe("handyman plumbing routing", () => {
  it("maps standard jobs to general plumber", () => {
    const job = getPlumbingJobType("leaking_tap");
    expect(job?.routeToWorkerType).toBe("general_plumber");
    expect(job?.bookingMode).toBe("standard_repair_visit");
    expect(job?.requiresAdminReview).toBe(false);
  });

  it("routes borehole issues to specialist review", () => {
    const resolved = resolvePlumbingJob("borehole_pump_issue");
    expect(resolved?.effectiveRoute).toBe("borehole_pump_technician");
    expect(resolved?.effectiveBookingMode).toBe("specialist_quote_request");
    expect(resolved?.effectiveRequiresAdminReview).toBe(true);
  });

  it("blocks emergency flooding when emergency plumbers are unavailable", () => {
    const resolved = resolvePlumbingJob("emergency_flooding");
    expect(resolved?.blocked).toBe(true);
    expect(isPlumbingBookingBlocked({
      ...defaultServiceDetails("handyman"),
      serviceType: "plumbing",
      plumbingJobType: "emergency_flooding",
    })).toBe(true);
  });

  it("escalates active uncontrollable pipe leaks to specialist review when emergency is unavailable", () => {
    const resolved = resolvePlumbingJob("visible_pipe_leak", {
      activeLeak: true,
      waterShutoffAvailable: false,
    });
    expect(resolved?.effectiveRoute).toBe("specialist_plumber");
    expect(resolved?.effectiveBookingMode).toBe("specialist_quote_request");
    expect(resolved?.blocked).toBe(false);
  });

  it("keeps general plumber skills backward compatible", () => {
    expect(workerSkillsForPlumbingRoute("general_plumber")).toEqual([
      "general_plumber",
      "plumbing",
    ]);
  });

  it("hides emergency flooding from the classifier when emergency is unavailable", () => {
    const ids = selectablePlumbingJobTypes().map((job) => job.id);
    expect(ids).not.toContain("emergency_flooding");
  });

  it("applies inspection addon for unclear jobs", () => {
    const details = applyPlumbingJobToDetails(
      { ...defaultServiceDetails("handyman"), serviceType: "plumbing", addons: [] },
      "not_sure"
    );
    expect(details.handymanBookingMode).toBe("inspection_only");
    expect(details.addons).toContain("inspection_only");
    expect(details.routeToWorkerType).toBe("general_plumber");
  });
});
