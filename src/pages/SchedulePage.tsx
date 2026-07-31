import { useMemo, useState } from "react";
import AddTaskModal from "../components/tasks/AddTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import { useTasksStore } from "../store/useTasksStore";
import type { Task } from "../store/useTasksStore";
import {
  formatMonthLabel,
  getMonthFromDateKey,
  getMonthGrid,
  shiftMonth,
} from "../utils/calendarUtils";
import { getTodayDate, isOverdue } from "../utils/dateUtils";

const weekdayLabels = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

function getTaskClasses(task: Task) {
  if (task.status === "done") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800 line-through";
  }

  if (isOverdue(task.dueDate)) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (task.priority === "high") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (task.status === "inProgress") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getMonthPrefix(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-`;
}

export default function SchedulePage() {
  const { tasks } = useTasksStore();
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getMonthFromDateKey(),
  );
  const [newTaskDate, setNewTaskDate] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const today = getTodayDate();
  const calendarDays = useMemo(
    () => getMonthGrid(visibleMonth),
    [visibleMonth],
  );
  const tasksByDate = useMemo(() => {
    const groupedTasks = new Map<string, Task[]>();

    tasks.forEach((task) => {
      const dayTasks = groupedTasks.get(task.dueDate) ?? [];

      dayTasks.push(task);
      groupedTasks.set(task.dueDate, dayTasks);
    });

    groupedTasks.forEach((dayTasks) => {
      dayTasks.sort((firstTask, secondTask) => {
        if (firstTask.status === "done" && secondTask.status !== "done") {
          return 1;
        }

        if (firstTask.status !== "done" && secondTask.status === "done") {
          return -1;
        }

        if (firstTask.priority === "high" && secondTask.priority !== "high") {
          return -1;
        }

        if (firstTask.priority !== "high" && secondTask.priority === "high") {
          return 1;
        }

        return firstTask.title.localeCompare(secondTask.title, "he");
      });
    });

    return groupedTasks;
  }, [tasks]);

  const monthPrefix = getMonthPrefix(visibleMonth.year, visibleMonth.month);
  const monthTasks = tasks.filter((task) => task.dueDate.startsWith(monthPrefix));
  const openMonthTasks = monthTasks.filter((task) => task.status !== "done");
  const completedMonthTasks = monthTasks.filter(
    (task) => task.status === "done",
  );
  const overdueMonthTasks = openMonthTasks.filter((task) =>
    isOverdue(task.dueDate),
  );
  const highPriorityMonthTasks = openMonthTasks.filter(
    (task) => task.priority === "high",
  );
  const priorityTasks = highPriorityMonthTasks
    .sort((firstTask, secondTask) =>
      firstTask.dueDate.localeCompare(secondTask.dueDate),
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-surface px-8 pt-24 pb-12 text-on-surface">
      <div className="mx-auto w-full max-w-[1440px]">
        <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 text-label-caps text-on-surface-variant">
              תכנון לפי משימות
            </div>
            <h2 className="text-h1 text-on-surface">לוח זמנים</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              לחץ על יום כדי ליצור משימה, או על משימה קיימת כדי לערוך אותה.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewTaskDate(today)}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            משימה חדשה להיום
          </button>
        </section>

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm xl:col-span-9">
            <div className="flex flex-col gap-4 border-b border-outline-variant p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h3 className="min-w-40 text-h3">
                  {formatMonthLabel(visibleMonth)}
                </h3>

                <div className="flex overflow-hidden rounded-lg border border-outline-variant">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleMonth((currentMonth) =>
                        shiftMonth(currentMonth, -1),
                      )
                    }
                    aria-label="החודש הקודם"
                    className="border-l border-outline-variant p-2 transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleMonth((currentMonth) =>
                        shiftMonth(currentMonth, 1),
                      )
                    }
                    aria-label="החודש הבא"
                    className="p-2 transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVisibleMonth(getMonthFromDateKey(today))}
                className="w-fit rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
              >
                חזרה להיום
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[840px]">
                <div className="grid grid-cols-7 gap-px bg-outline-variant">
                  {weekdayLabels.map((dayLabel) => (
                    <div
                      key={dayLabel}
                      className="bg-surface-container-low p-3 text-center text-xs font-semibold text-on-surface-variant"
                    >
                      {dayLabel}
                    </div>
                  ))}

                  {calendarDays.map((day) => {
                    const dayTasks = tasksByDate.get(day.dateKey) ?? [];
                    const visibleTasks = dayTasks.slice(0, 3);
                    const hiddenTasksCount = dayTasks.length - visibleTasks.length;
                    const isToday = day.dateKey === today;

                    return (
                      <div
                        key={day.dateKey}
                        onClick={() => setNewTaskDate(day.dateKey)}
                        className={`min-h-36 cursor-pointer bg-white p-2 transition-colors hover:bg-slate-50 ${
                          day.isCurrentMonth
                            ? ""
                            : "bg-surface-container-low/60 text-on-surface-variant/60"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setNewTaskDate(day.dateKey);
                            }}
                            aria-label={`הוסף משימה לתאריך ${day.dateKey}`}
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                              isToday
                                ? "bg-primary text-white"
                                : day.isCurrentMonth
                                  ? "text-on-surface"
                                  : "text-on-surface-variant/60"
                            }`}
                          >
                            {day.dayNumber}
                          </button>

                          {dayTasks.length > 0 && (
                            <span className="text-[10px] font-semibold text-on-surface-variant">
                              {dayTasks.length}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {visibleTasks.map((task) => (
                            <button
                              key={task.id}
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedTask(task);
                              }}
                              className={`block w-full truncate rounded-md border px-2 py-1.5 text-right text-[11px] font-semibold transition-transform hover:-translate-y-0.5 ${getTaskClasses(task)}`}
                              title={task.title}
                            >
                              {task.title}
                            </button>
                          ))}

                          {hiddenTasksCount > 0 && (
                            <div className="px-2 text-[10px] font-semibold text-on-surface-variant">
                              ועוד {hiddenTasksCount}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <aside className="col-span-12 flex flex-col gap-6 xl:col-span-3">
            <div className="rounded-xl border border-outline-variant bg-white p-6 shadow-sm">
              <h3 className="text-h3 text-on-surface">סיכום החודש</h3>
              <p className="mt-1 text-xs text-on-surface-variant">
                {formatMonthLabel(visibleMonth)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface-container-low p-4">
                  <p className="text-xs text-on-surface-variant">פתוחות</p>
                  <p className="mt-1 text-h2 text-on-surface">
                    {openMonthTasks.length}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-700">הושלמו</p>
                  <p className="mt-1 text-h2 text-emerald-800">
                    {completedMonthTasks.length}
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-xs text-red-600">באיחור</p>
                  <p className="mt-1 text-h2 text-red-700">
                    {overdueMonthTasks.length}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs text-amber-700">עדיפות גבוהה</p>
                  <p className="mt-1 text-h2 text-amber-800">
                    {highPriorityMonthTasks.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-on-surface">
                  משימות חשובות
                </h3>
                <span className="text-xs text-on-surface-variant">
                  {highPriorityMonthTasks.length}
                </span>
              </div>

              {priorityTasks.length > 0 ? (
                <div className="space-y-3">
                  {priorityTasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => setSelectedTask(task)}
                      className="w-full rounded-lg border border-amber-200 bg-amber-50 p-3 text-right transition-colors hover:bg-amber-100"
                    >
                      <p className="text-sm font-semibold text-amber-900">
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-amber-700">
                        יעד: {task.dueDate}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-surface-container-low p-4 text-sm leading-6 text-on-surface-variant">
                  אין משימות בעדיפות גבוהה בחודש הזה.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-outline-variant bg-white p-5 text-xs text-on-surface-variant shadow-sm">
              <p className="mb-3 font-semibold text-on-surface">מקרא</p>
              <div className="grid grid-cols-2 gap-3">
                <span className="flex items-center gap-2">
                  <i className="h-3 w-3 rounded bg-red-100" /> באיחור
                </span>
                <span className="flex items-center gap-2">
                  <i className="h-3 w-3 rounded bg-amber-100" /> גבוהה
                </span>
                <span className="flex items-center gap-2">
                  <i className="h-3 w-3 rounded bg-blue-100" /> בעבודה
                </span>
                <span className="flex items-center gap-2">
                  <i className="h-3 w-3 rounded bg-emerald-100" /> הושלמה
                </span>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {newTaskDate && (
        <AddTaskModal
          initialDueDate={newTaskDate}
          onClose={() => setNewTaskDate(null)}
          onTaskCreated={() => setNewTaskDate(null)}
        />
      )}

      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </main>
  );
}
