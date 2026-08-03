import type { Task } from "../store/useTasksStore";
import { Link } from "react-router-dom";

type FocusSessionProps = {
  tasks: Task[];
};

function getTaskDate(task: Task) {
  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return new Date(8640000000000000);
  }

  return dueDate;
}

function getFocusTask(tasks: Task[]) {
  return tasks
    .filter((task) => task.status !== "done")
    .sort((firstTask, secondTask) => {
      if (firstTask.priority === "high" && secondTask.priority !== "high") {
        return -1;
      }

      if (firstTask.priority !== "high" && secondTask.priority === "high") {
        return 1;
      }

      if (
        firstTask.status === "inProgress" &&
        secondTask.status !== "inProgress"
      ) {
        return -1;
      }

      if (
        firstTask.status !== "inProgress" &&
        secondTask.status === "inProgress"
      ) {
        return 1;
      }

      return (
        getTaskDate(firstTask).getTime() - getTaskDate(secondTask).getTime()
      );
    })[0];
}

function getFocusProgress(task?: Task) {
  if (!task) {
    return 0;
  }

  if (task.status === "inProgress") {
    return 65;
  }

  if (task.priority === "high") {
    return 45;
  }

  return 25;
}

function formatDueDate(task?: Task) {
  if (!task) {
    return "אין משימות פתוחות כרגע";
  }

  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return "ללא תאריך יעד תקין";
  }

  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "long",
  }).format(dueDate);
}

export default function FocusSession({ tasks }: FocusSessionProps) {
  const focusTask = getFocusTask(tasks);
  const progress = getFocusProgress(focusTask);
  const minutes = focusTask?.status === "inProgress" ? 45 : 25;

  return (
    <div className="group relative col-span-12 flex flex-col rounded-xl border border-slate-200 bg-white/90 p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] lg:col-span-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-fixed/40 ring-1 ring-tertiary-fixed/40">
          <span className="material-symbols-outlined text-on-tertiary-fixed-variant">
            psychology
          </span>
        </div>

        <div>
          <h3 className="text-h3 text-primary">סשן ריכוז</h3>
          <p className="text-xs text-slate-500">מבוסס על המשימה הבאה שלך</p>
        </div>
      </div>

      {/* Circle */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 shadow-inner">
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r="56"
              strokeWidth="8"
              className="text-slate-100"
              stroke="currentColor"
              fill="transparent"
            />

            <circle
              cx="64"
              cy="64"
              r="56"
              strokeWidth="8"
              strokeDasharray="351.85"
              strokeDashoffset={351.85 - (351.85 * progress) / 100}
              className="text-blue-600 drop-shadow-sm transition-all duration-700"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          <div className="absolute text-center">
            <span className="text-2xl font-bold text-primary">{minutes}</span>
            <span className="block text-[10px] uppercase text-slate-400">
              דקות
            </span>
          </div>
        </div>

        <div className="mt-6 px-4 text-center">
          {focusTask ? (
            <>
              <p className="text-sm text-slate-500">המשימה המומלצת לפוקוס</p>
              <p className="mt-2 text-sm font-bold leading-6 text-primary">
                {focusTask.title}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                יעד: {formatDueDate(focusTask)}
              </p>
            </>
          ) : (
            <p className="text-sm leading-6 text-slate-600">
              אין משימות פתוחות כרגע. זמן טוב לסגור קצוות או לתכנן את המשימה
              הבאה.
            </p>
          )}
        </div>
      </div>

      {/* Button */}
      <Link
        to="/tasks"
        className="mt-6 w-full rounded-xl bg-surface-container py-3 text-center text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
      >
        {focusTask ? "פתח בלוח המשימות" : "פתח משימה חדשה"}
      </Link>
    </div>
  );
}
