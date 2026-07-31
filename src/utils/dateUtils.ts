export const APP_TIME_ZONE = "Asia/Jerusalem";

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function getDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function getTodayDate() {
  return getDateKey();
}

export function normalizeDateKey(value?: string) {
  if (!value || value === "היום") {
    return getTodayDate();
  }

  if (dateKeyPattern.test(value)) {
    return value;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return getTodayDate();
  }

  return getDateKey(parsedDate);
}

function parseDateForDisplay(value: string) {
  if (!dateKeyPattern.test(value)) {
    return new Date(value);
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const shiftedDate = new Date(Date.UTC(year, month - 1, day + days, 12));

  return shiftedDate.toISOString().slice(0, 10);
}

export function getRecentDateKeys(days: number) {
  const today = getTodayDate();

  return Array.from({ length: days }, (_, index) =>
    shiftDateKey(today, index - (days - 1)),
  );
}

export function isTimestampOnDate(timestamp: string | undefined, dateKey: string) {
  if (!timestamp) {
    return false;
  }

  const parsedDate = new Date(timestamp);

  return !Number.isNaN(parsedDate.getTime()) && getDateKey(parsedDate) === dateKey;
}

export function isCompletedToday(completedAt?: string) {
  return isTimestampOnDate(completedAt, getTodayDate());
}

export function formatWeekday(dateKey: string) {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: APP_TIME_ZONE,
    weekday: "narrow",
  }).format(parseDateForDisplay(dateKey));
}

export function formatTaskDate(date?: string) {
  if (!date) {
    return "ללא תאריך";
  }

  const parsedDate = parseDateForDisplay(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("he-IL", {
    timeZone: APP_TIME_ZONE,
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export function isOverdue(date?: string) {
  if (!date) {
    return false;
  }

  const normalizedDate = normalizeDateKey(date);

  return normalizedDate < getTodayDate();
}
