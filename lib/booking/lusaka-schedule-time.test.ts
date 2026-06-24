import { describe, expect, it } from "vitest";
import {
  getLusakaTodayIsoDate,
  getLusakaNowMinutes,
  isLusakaSameDay,
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
});
