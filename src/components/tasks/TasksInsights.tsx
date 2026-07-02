import type { Task, TaskCategory } from "../../store/useTasksStore";

type TasksInsightsProps = {
  tasks: Task[];
};

type WeeklyCompletionDay = {
  dateKey: string;
  label: string;
  completedCount: number;
};

const categoryLabels: Record<TaskCategory, string> = {
  personal: "אישי",
  work: "עבודה",
  security: "ביטחון / מלונות",
  project: "פרויקט",
  home: "בית",
};

const weekdayLabels = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

function getStartOfDay(date: Date) {
  const startOfDay = new Date(date);

  startOfDay.setHours(0, 0, 0, 0);

  return startOfDay;
}

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function getWeeklyCompletionData(tasks: Task[]): WeeklyCompletionDay[] {
  const today = getStartOfDay(new Date());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);

    day.setDate(today.getDate() - (6 - index));

    const completedCount = tasks.filter((task) => {
      if (task.status !== "done" || !task.completedAt) {
        return false;
      }

      const completedDate = new Date(task.completedAt);

      if (Number.isNaN(completedDate.getTime())) {
        return false;
      }

      return getStartOfDay(completedDate).getTime() === day.getTime();
    }).length;

    return {
      dateKey: getDateKey(day),
      label: weekdayLabels[day.getDay()],
      completedCount,
    };
  });
}

function getCategoryData(tasks: Task[]) {
  const activeTasks = tasks.filter((task) => task.status !== "done");
  const totalActiveTasks = activeTasks.length;

  return (Object.keys(categoryLabels) as TaskCategory[])
    .map((category) => {
      const count = activeTasks.filter(
        (task) => task.category === category,
      ).length;
      const percentage = totalActiveTasks
        ? Math.round((count / totalActiveTasks) * 100)
        : 0;

      return {
        category,
        label: categoryLabels[category],
        count,
        percentage,
      };
    })
    .filter((categoryData) => categoryData.count > 0)
    .sort(
      (firstCategory, secondCategory) =>
        secondCategory.count - firstCategory.count,
    );
}

export default function TasksInsights({ tasks }: TasksInsightsProps) {
  const weeklyCompletionData = getWeeklyCompletionData(tasks);
  const maxCompletedCount = Math.max(
    1,
    ...weeklyCompletionData.map((day) => day.completedCount),
  );

  const categoryData = getCategoryData(tasks);
  const totalCompletedThisWeek = weeklyCompletionData.reduce(
    (total, day) => total + day.completedCount,
    0,
  );

  return (
    <section className="grid grid-cols-12 gap-gutter pb-margin">
      <div className="col-span-12 rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] lg:col-span-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-h3 font-h3 text-on-surface">
              מגמות פרודוקטיביות
            </h3>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              משימות שהושלמו בשבעת הימים האחרונים
            </p>
          </div>

          <div className="rounded-xl bg-secondary/10 px-4 py-2 text-center">
            <p className="text-label-caps text-on-surface-variant">השבוע</p>
            <p className="text-h3 font-h3 text-on-surface">
              {totalCompletedThisWeek}
            </p>
          </div>
        </div>

        <div className="flex h-48 items-end justify-between gap-2 px-2">
          {weeklyCompletionData.map((day) => {
            const heightPercentage = Math.max(
              day.completedCount === 0 ? 8 : 18,
              Math.round((day.completedCount / maxCompletedCount) * 100),
            );

            return (
              <div
                key={day.dateKey}
                className="flex h-full w-full flex-col justify-end gap-2"
              >
                <div className="text-center text-body-sm font-semibold text-on-surface-variant">
                  {day.completedCount}
                </div>
                <div
                  className={`w-full rounded-t transition-all hover:bg-secondary/30 ${
                    day.completedCount > 0 ? "bg-secondary" : "bg-secondary/10"
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                  title={`${day.completedCount} משימות הושלמו`}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between px-2 text-label-caps text-on-surface-variant">
          {weeklyCompletionData.map((day) => (
            <span key={day.dateKey}>{day.label}</span>
          ))}
        </div>
      </div>

      <div className="col-span-12 rounded-xl bg-primary p-card-padding text-on-primary shadow-[0px_4px_20px_rgba(0,0,0,0.05)] lg:col-span-4">
        <h3 className="mb-2 text-h3 font-h3">עומס לפי תחום</h3>
        <p className="mb-6 text-body-sm text-on-primary/80">
          חלוקת המשימות הפתוחות לפי תחומי אחריות.
        </p>

        {categoryData.length > 0 ? (
          <div className="space-y-6">
            {categoryData.map((category) => (
              <div key={category.category} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex justify-between gap-4">
                    <span className="text-body-sm font-semibold">
                      {category.label}
                    </span>
                    <span className="text-body-sm text-on-primary/80">
                      {category.count} · {category.percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-white/20">
                    <div
                      className="h-1.5 rounded-full bg-tertiary-fixed-dim"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-5 text-body-sm leading-6 text-on-primary/85">
            אין כרגע משימות פתוחות. ברגע שתיצור משימות חדשות, תופיע כאן
            חלוקה לפי תחומים.
          </div>
        )}
      </div>
    </section>
  );
}