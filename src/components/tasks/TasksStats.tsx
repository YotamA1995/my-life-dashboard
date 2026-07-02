import type { Task } from "../../store/useTasksStore";

type TasksStatsProps = {
  tasks: Task[];
};

export default function TasksStats({ tasks }: TasksStatsProps) {
  const activeTasks = tasks.filter((task) => task.status !== "done").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "inProgress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;

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
      label: "הושלמו",
      value: completedTasks,
      valueClass: "text-on-tertiary-container",
    },
    {
      label: "דחופות",
      value: highPriorityTasks,
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
