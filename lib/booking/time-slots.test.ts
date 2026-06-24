import { describe, expect, it } from "vitest";
import {
  clampStartTimeForDuration,
  filterStartTimesByDuration,
  formatEstimatedEnd,
  getAllowedDurations,
  getAvailableStartTimes,
  getLatestStartForDuration,
  getScheduleFeasibility,
  isScheduleBookable,
  isStartTimeValidForDuration,
} from "./time-slots";

describe("schedule feasibility", () => {
  it("flags an 8-hour visit starting at 4 PM as invalid for standard cleaning", () => {
    const feasibility = getScheduleFeasibility({
      startTime: "16:00",
      durationHours: 8,
      category: "cleaning",
      serviceType: "standard",
      serviceDate: "2026-06-20",
    });

    expect(feasibility.valid).toBe(false);
    expect(feasibility.endTimeLabel).toBe("12:00 AM (next day)");
    expect(feasibility.latestStartLabel).toBe("9:00 AM");
  });

  it("allows an 8-hour visit that finishes at 5 PM when starting at 9 AM", () => {
    expect(
      isStartTimeValidForDuration("09:00", 8, "cleaning", "standard")
    ).toBe(true);
    expect(formatEstimatedEnd("09:00", 8)).toBe("5:00 PM");
  });

  it("filters late starts for long visits", () => {
    const valid = filterStartTimesByDuration(
      [
        { value: "09:00", label: "9:00 AM to 9:30 AM" },
        { value: "16:00", label: "4:00 PM to 4:30 PM" },
      ],
      8,
      "housekeeping",
      "full_day"
    );

    expect(valid.map((slot) => slot.value)).toEqual(["09:00"]);
    expect(getLatestStartForDuration(8, "housekeeping", "full_day")?.value).toBe("09:00");
  });

  it("clamps a late start when duration increases", () => {
    expect(
      clampStartTimeForDuration("16:00", 8, "cleaning", "standard")
    ).toBe("09:00");
  });

  it("limits evening nanny visits to 4 hours", () => {
    expect(getAllowedDurations("17:00", "nanny", "babysitter")).toEqual([3, 4]);
    expect(isStartTimeValidForDuration("17:00", 6, "nanny", "babysitter")).toBe(false);
    expect(isStartTimeValidForDuration("17:00", 4, "nanny", "babysitter")).toBe(true);
  });

  it("leaves no same-day slots for a 4-hour garden visit after 4 PM Lusaka time", () => {
    const now = new Date("2026-06-20T14:07:00.000Z");
    const today = "2026-06-20";
    const slots = getAvailableStartTimes({
      category: "garden",
      serviceType: "lawn_cutting",
      serviceDate: today,
      durationHours: 4,
      now,
    });

    expect(slots).toEqual([]);
    expect(
      isScheduleBookable({
        serviceDate: today,
        startTime: "16:00",
        durationHours: 4,
        category: "garden",
        serviceType: "lawn_cutting",
        now,
      })
    ).toBe(false);
    expect(
      isScheduleBookable({
        serviceDate: today,
        startTime: "08:00",
        durationHours: 4,
        category: "garden",
        serviceType: "lawn_cutting",
        now,
      })
    ).toBe(false);
  });
});
