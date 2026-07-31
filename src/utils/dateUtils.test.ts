import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getDateKey,
  getRecentDateKeys,
  getTodayDate,
  isCompletedToday,
  isOverdue,
  normalizeDateKey,
  shiftDateKey,
} from "./dateUtils";

afterEach(() => {
  vi.useRealTimers();
});

describe("dateUtils", () => {
  it("uses the calendar date in Israel instead of the UTC date", () => {
    expect(getDateKey(new Date("2026-07-31T21:30:00.000Z"))).toBe(
      "2026-08-01",
    );
  });

  it("normalizes timestamps into an Israeli date key", () => {
    expect(normalizeDateKey("2026-07-31T21:30:00.000Z")).toBe("2026-08-01");
  });

  it("compares due dates against the current day in Israel", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-31T21:30:00.000Z"));

    expect(getTodayDate()).toBe("2026-08-01");
    expect(isOverdue("2026-07-31")).toBe(true);
    expect(isOverdue("2026-08-01")).toBe(false);
    expect(isCompletedToday("2026-07-31T21:45:00.000Z")).toBe(true);
  });

  it("creates stable date ranges across month boundaries", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-31T21:30:00.000Z"));

    expect(shiftDateKey("2026-08-01", -1)).toBe("2026-07-31");
    expect(getRecentDateKeys(3)).toEqual([
      "2026-07-30",
      "2026-07-31",
      "2026-08-01",
    ]);
  });
});
