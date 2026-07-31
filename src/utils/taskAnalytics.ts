import type { Task } from "../store/useTasksStore";
import {
  formatWeekday,
  getRecentDateKeys,
  isTimestampOnDate,
} from "./dateUtils";

export type WeeklyCompletionDay = {
  dateKey: string;
  label: string;
  completedCount: number;
};

export function getWeeklyCompletionData(
  tasks: Task[],
): WeeklyCompletionDay[] {
  return getRecentDateKeys(7).map((dateKey) => ({
    dateKey,
    label: formatWeekday(dateKey),
    completedCount: tasks.filter(
      (task) =>
        task.status === "done" &&
        isTimestampOnDate(task.completedAt, dateKey),
    ).length,
  }));
}
