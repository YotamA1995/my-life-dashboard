import { useState } from "react";
import type { FormEvent } from "react";
import { useTasksStore } from "../store/useTasksStore";
import type { Task, TaskPriority, TaskStatus } from "../store/useTasksStore";

const columns: { title: string; status: TaskStatus }[] = [
  { title: "לביצוע", status: "todo" },
  { title: "בתהליך", status: "inProgress" },
  { title: "בבדיקה", status: "review" },
  { title: "בוצע", status: "done" },
];

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-blue-50 text-blue-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
  completed: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "נמוך",
  medium: "בינוני",
  high: "גבוה",
  completed: "הושלם",
};

function TaskCard({ task }: { task: Task }) {
  const { moveTask, deleteTask } = useTasksStore();
  const isDone = task.status === "done";

  return (
    <div
      className={`group rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] ${
        task.status === "inProgress" ? "border-r-4 border-r-secondary" : ""
      } ${isDone ? "bg-white/60 opacity-80 grayscale-[0.4]" : ""}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className={`rounded px-2 py-1 text-label-caps ${priorityStyles[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>

        <button
          className="text-slate-300 opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
          type="button"
          onClick={() => deleteTask(task.id)}
          aria-label="מחיקת משימה"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>

      <h4 className={`mb-4 text-body-md text-on-surface ${isDone ? "line-through" : ""}`}>
        {task.title}
      </h4>

      <div className="mb-4 flex items-center text-body-sm text-on-surface-variant">
        <span className="material-symbols-outlined ml-1 text-[18px]">calendar_today</span>
        {task.dueDate}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {task.status !== "todo" && (
          <button
            className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
            type="button"
            onClick={() => moveTask(task.id, "todo")}
          >
            לביצוע
          </button>
        )}

        {task.status !== "inProgress" && (
          <button
            className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
            type="button"
            onClick={() => moveTask(task.id, "inProgress")}
          >
            לתהליך
          </button>
        )}

        {task.status !== "review" && (
          <button
            className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
            type="button"
            onClick={() => moveTask(task.id, "review")}
          >
            לבדיקה
          </button>
        )}

        {task.status !== "done" && (
          <button
            className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            type="button"
            onClick={() => moveTask(task.id, "done")}
          >
            בוצע
          </button>
        )}
      </div>
    </div>
  );
}

function AddTaskForm({ status }: { status: TaskStatus }) {
  const { addTask } = useTasksStore();
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTask(title, status);
    setTitle("");
  }

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="הוסף משימה..."
        className="w-full rounded-lg border border-outline-variant bg-white py-3 pr-4 pl-10 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
      />
      <button
        className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
        type="submit"
        aria-label="הוסף משימה"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </form>
  );
}

export default function TasksPage() {
  const { tasks } = useTasksStore();

  const activeTasks = tasks.filter((task) => task.status !== "done").length;
  const reviewTasks = tasks.filter((task) => task.status === "review").length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const urgentTasks = tasks.filter((task) => task.priority === "high" && task.status !== "done").length;

  const stats = [
    { label: "משימות פעילות", value: String(activeTasks).padStart(2, "0") },
    { label: "ממתין לסקירה", value: String(reviewTasks).padStart(2, "0") },
    { label: "הושלמו היום", value: String(completedTasks).padStart(2, "0"), highlight: true },
    { label: "מועד הגשה קרוב", value: String(urgentTasks).padStart(2, "0"), danger: true },
  ];

  return (
    <main className="min-h-screen bg-surface px-8 pt-24 pb-12 text-on-surface">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Header */}
        <section className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-h1 text-on-surface">מרכז ניהול משימות</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              נהל משימות, עקוב אחרי סטטוס, והעבר עבודה בין שלבים.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-margin grid grid-cols-1 gap-gutter md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]"
            >
              <p className="mb-2 text-label-caps text-on-surface-variant">{item.label}</p>
              <h3
                className={`text-h1 ${
                  item.danger
                    ? "text-error"
                    : item.highlight
                    ? "text-on-tertiary-container"
                    : "text-on-surface"
                }`}
              >
                {item.value}
              </h3>
            </div>
          ))}
        </section>

        {/* Kanban */}
        <section className="mb-8 flex gap-gutter overflow-x-auto pb-8">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.status);

            return (
              <div key={column.status} className="flex w-80 flex-shrink-0 flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-h3 text-on-surface">
                    {column.title}
                    <span className="mr-2 text-body-sm font-normal text-on-surface-variant">
                      {columnTasks.length}
                    </span>
                  </h3>
                  <span className="material-symbols-outlined cursor-pointer text-slate-400">
                    more_horiz
                  </span>
                </div>

                <div className="flex min-h-[360px] flex-1 flex-col gap-4 rounded-2xl bg-slate-50/60 p-3">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="flex min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/50 text-sm text-on-surface-variant">
                      אין משימות בעמודה הזו
                    </div>
                  )}

                  <AddTaskForm status={column.status} />
                </div>
              </div>
            );
          })}
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 rounded-xl border bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] lg:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-h3">מגמות פרודוקטיביות</h3>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-secondary" />
                <span className="text-body-sm text-on-surface-variant">משימות שהושלמו</span>
              </div>
            </div>

            <div className="flex h-48 items-end gap-2">
              {[40, 65, 35, 85, 55, 70, 95].map((height, index) => (
                <div
                  key={index}
                  className={`w-full rounded-t transition-all hover:bg-secondary/30 ${
                    index === 6 ? "bg-secondary" : "bg-secondary/10"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="col-span-12 rounded-xl bg-primary p-card-padding text-white lg:col-span-4">
            <h3 className="mb-6 text-h3">עומס עבודה בצוות</h3>

            {[
              { name: "דוד חן", value: 85 },
              { name: "ילנה רוסי", value: 42 },
            ].map((member) => (
              <div key={member.name} className="mb-6">
                <div className="mb-1 flex justify-between text-sm">
                  <span>{member.name}</span>
                  <span>{member.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/20">
                  <div
                    className="h-1.5 rounded-full bg-tertiary-fixed-dim"
                    style={{ width: `${member.value}%` }}
                  />
                </div>
              </div>
            ))}

            <button className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 py-3 text-body-sm font-semibold transition-all hover:bg-white/20">
              צפה במפת משאבים
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}