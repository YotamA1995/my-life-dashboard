import { describe, expect, it } from "vitest";
import {
  formatMonthLabel,
  getMonthFromDateKey,
  getMonthGrid,
  shiftMonth,
} from "./calendarUtils";

describe("calendarUtils", () => {
  it("builds a complete six-week grid starting on Sunday", () => {
    const grid = getMonthGrid({ year: 2026, month: 7 });

    expect(grid).toHaveLength(42);
    expect(grid[0].dateKey).toBe("2026-07-26");
    expect(grid[6].dateKey).toBe("2026-08-01");
    expect(grid[41].dateKey).toBe("2026-09-05");
    expect(grid.filter((day) => day.isCurrentMonth)).toHaveLength(31);
  });

  it("moves safely across year boundaries", () => {
    expect(shiftMonth({ year: 2026, month: 11 }, 1)).toEqual({
      year: 2027,
      month: 0,
    });
    expect(shiftMonth({ year: 2026, month: 0 }, -1)).toEqual({
      year: 2025,
      month: 11,
    });
  });

  it("derives and formats a month from an Israeli date key", () => {
    expect(getMonthFromDateKey("2026-08-01")).toEqual({
      year: 2026,
      month: 7,
    });
    expect(formatMonthLabel({ year: 2026, month: 7 })).toContain("אוגוסט");
  });
});
