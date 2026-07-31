import { APP_TIME_ZONE, getTodayDate, shiftDateKey } from "./dateUtils";

export type CalendarDay = {
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

export type CalendarMonth = {
  year: number;
  month: number;
};

export function getMonthFromDateKey(dateKey = getTodayDate()): CalendarMonth {
  const [year, month] = dateKey.split("-").map(Number);

  return { year, month: month - 1 };
}

export function shiftMonth(
  calendarMonth: CalendarMonth,
  amount: number,
): CalendarMonth {
  const shiftedDate = new Date(
    Date.UTC(calendarMonth.year, calendarMonth.month + amount, 1, 12),
  );

  return {
    year: shiftedDate.getUTCFullYear(),
    month: shiftedDate.getUTCMonth(),
  };
}

export function getMonthGrid({
  year,
  month,
}: CalendarMonth): CalendarDay[] {
  const firstDay = new Date(Date.UTC(year, month, 1, 12));
  const gridStart = shiftDateKey(
    firstDay.toISOString().slice(0, 10),
    -firstDay.getUTCDay(),
  );

  return Array.from({ length: 42 }, (_, index) => {
    const dateKey = shiftDateKey(gridStart, index);
    const [dayYear, dayMonth, dayNumber] = dateKey.split("-").map(Number);

    return {
      dateKey,
      dayNumber,
      isCurrentMonth: dayYear === year && dayMonth === month + 1,
    };
  });
}

export function formatMonthLabel({ year, month }: CalendarMonth) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: APP_TIME_ZONE,
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month, 1, 12)));
}
