import type { Task } from "../../store/useTasksStore";

type TasksStatsProps = {
  tasks: Task[];
};

function isCompletedToday(completedAt?: string) {
  if (!completedAt) {
    return false;
  }

  const completedDate = new Date(completedAt);

  if (Number.isNaN(completedDate.getTime())) {
    return false;
  }

  const today = new Date();

  return completedDate.toDateString() === today.toDateString();
}

function isTaskOverdue(task: Task) {
  if (task.status === "done") {
    return false;
  }

  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

export default function TasksStats({ tasks }: TasksStatsProps) {
  const activeTasks = tasks.filter((task) => task.status !== "done").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "inProgress"
  ).length;

  const completedTodayTasks = tasks.filter((task) =>
    isCompletedToday(task.completedAt)
  ).length;

  const overdueTasks = tasks.filter(isTaskOverdue).length;

  const stats = [
    {
      label: "משימות פעילות",
      value: activeTasks,
      valueClass: "text-on-surface",
    },
    {
      label: "בתהליך",
      value: inProgressTasks,
      valueClass: "text-on-surface",
    },
    {
      label: "הושלמו היום",
      value: completedTodayTasks,
      valueClass: "text-on-tertiary-container",
    },
    {
      label: "באיחור",
      value: overdueTasks,
      valueClass: "text-error",
    },
  ];

  return (
    <section className="mb-margin grid grid-cols-1 gap-gutter md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)]"
        >
          <p className="mb-2 text-label-caps font-label-caps text-on-surface-variant">
            {stat.label}
          </p>

          <h3 className={`text-h1 font-h1 ${stat.valueClass}`}>
            {stat.value}
          </h3>
        </div>
      ))}
    </section>
  );
}
