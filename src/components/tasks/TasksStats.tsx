import type { Task } from "../../store/useTasksStore";
import { isCompletedToday, isOverdue } from "../../utils/dateUtils";

type TasksStatsProps = {
  tasks: Task[];
};

function isTaskOverdue(task: Task) {
  return task.status !== "done" && isOverdue(task.dueDate);
}

export default function TasksStats({ tasks }: TasksStatsProps) {
  const activeTasks = tasks.filter((task) => task.status !== "done").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "inProgress",
  ).length;

  const completedTodayTasks = tasks.filter((task) =>
    isCompletedToday(task.completedAt),
  ).length;

  const overdueTasks = tasks.filter(isTaskOverdue).length;

  const stats = [
    {
      label: "משימות פעילות",
      value: activeTasks,
      description: "פתוחות לטיפול",
      icon: "checklist",
      valueClass: "text-on-surface",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "בתהליך",
      value: inProgressTasks,
      description: "משימות שכבר התחילו",
      icon: "pending_actions",
      valueClass: "text-on-surface",
      iconClass: "bg-secondary/10 text-secondary",
    },
    {
      label: "הושלמו היום",
      value: completedTodayTasks,
      description: "נסגרו במהלך היום",
      icon: "task_alt",
      valueClass: "text-on-tertiary-container",
      iconClass: "bg-tertiary-fixed/40 text-on-tertiary-fixed-variant",
    },
    {
      label: "באיחור",
      value: overdueTasks,
      description: overdueTasks > 0 ? "דורש טיפול" : "אין איחורים",
      icon: "warning",
      valueClass: overdueTasks > 0 ? "text-error" : "text-on-surface",
      iconClass:
        overdueTasks > 0
          ? "bg-error-container text-on-error-container"
          : "bg-tertiary-fixed/40 text-on-tertiary-fixed-variant",
    },
  ];

  return (
    <section className="mb-margin grid grid-cols-1 gap-gutter md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant">
                {stat.label}
              </p>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                {stat.description}
              </p>
            </div>

            <span
              className={`material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconClass}`}
            >
              {stat.icon}
            </span>
          </div>

          <h3 className={`text-h1 font-h1 ${stat.valueClass}`}>
            {stat.value}
          </h3>
        </div>
      ))}
    </section>
  );
}
