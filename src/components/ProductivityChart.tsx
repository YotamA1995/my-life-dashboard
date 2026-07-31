import type { Task } from "../store/useTasksStore";
import { getWeeklyCompletionData } from "../utils/taskAnalytics";

type ProductivityChartProps = {
  tasks: Task[];
};

export default function ProductivityChart({ tasks }: ProductivityChartProps) {
  const weeklyCompletionData = getWeeklyCompletionData(tasks);
  const maxCompletedCount = Math.max(
    1,
    ...weeklyCompletionData.map((day) => day.completedCount),
  );
  const totalCompletedThisWeek = weeklyCompletionData.reduce(
    (total, day) => total + day.completedCount,
    0,
  );

  return (
    <section className="col-span-12 rounded-xl border border-slate-200 bg-white/90 p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] lg:col-span-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-h3 text-primary">קצב פרודוקטיביות</h3>
          <p className="mt-1 text-sm text-slate-500">
            משימות שהושלמו בשבעת הימים האחרונים
          </p>
        </div>

        <div className="rounded-xl bg-surface-container px-4 py-2 text-center">
          <p className="text-xs font-semibold text-slate-500">השבוע</p>
          <p className="text-h3 text-primary">{totalCompletedThisWeek}</p>
        </div>
      </div>

      <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 px-5 pt-6 pb-10">
        <div className="absolute inset-x-5 top-1/4 border-t border-dashed border-slate-200" />
        <div className="absolute inset-x-5 top-1/2 border-t border-dashed border-slate-200" />
        <div className="absolute inset-x-5 top-3/4 border-t border-dashed border-slate-200" />

        <div className="relative z-10 flex h-full items-end justify-between gap-4">
          {weeklyCompletionData.map((day) => {
            const heightPercentage = Math.max(
              day.completedCount === 0 ? 8 : 18,
              Math.round((day.completedCount / maxCompletedCount) * 100),
            );
            const isActive = day.completedCount === maxCompletedCount;

            return (
              <div
                key={day.dateKey}
                className="flex h-full flex-1 flex-col justify-end gap-3"
              >
                <div className="text-center text-xs font-semibold text-slate-500">
                  {day.completedCount}
                </div>

                <div className="flex h-full items-end">
                  <div
                    className={`w-full origin-bottom rounded-t-xl transition-all duration-300 hover:scale-y-105 hover:opacity-95 ${
                      isActive && day.completedCount > 0
                        ? "bg-blue-600 shadow-lg shadow-blue-600/20"
                        : day.completedCount > 0
                          ? "bg-blue-300 hover:bg-blue-400"
                          : "bg-blue-100 hover:bg-blue-200"
                    }`}
                    style={{ height: `${heightPercentage}%` }}
                    title={`${day.completedCount} משימות הושלמו`}
                  />
                </div>

                <span
                  className={`text-center text-xs font-semibold ${
                    isActive && day.completedCount > 0
                      ? "text-primary"
                      : "text-slate-400"
                  }`}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
