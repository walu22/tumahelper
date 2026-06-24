import { describe, expect, it } from "vitest";
import {
  getLusakaTodayIsoDate,
  getLusakaNowMinutes,
  isLusakaSameDay,
  isServiceDateBeforeToday,
} from "./lusaka-schedule-time";

describe("lusaka schedule time", () => {
  it("uses Africa/Lusaka for today date", () => {
    const eveningUtc = new Date("2026-06-20T22:30:00.000Z");
    expect(getLusakaTodayIsoDate(eveningUtc)).toBe("2026-06-21");
    expect(isLusakaSameDay("2026-06-21", eveningUtc)).toBe(true);
    expect(isLusakaSameDay("2026-06-20", eveningUtc)).toBe(false);
  });

  it("reads wall-clock minutes in Lusaka", () => {
    const fourOhSevenPmLusaka = new Date("2026-06-20T14:07:00.000Z");
    expect(getLusakaNowMinutes(fourOhSevenPmLusaka)).toBe(16 * 60 + 7);
  });

  it("detects calendar dates before today in Lusaka", () => {
    const now = new Date("2026-06-20T14:07:00.000Z");
    expect(isServiceDateBeforeToday("2026-06-19", now)).toBe(true);
    expect(isServiceDateBeforeToday("2026-06-20", now)).toBe(false);
    expect(isServiceDateBeforeToday("2026-06-21", now)).toBe(false);
  });
});
