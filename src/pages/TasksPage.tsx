import { useState } from "react";
import type { FormEvent } from "react";
import { useTasksStore } from "../store/useTasksStore";
import type { Task, TaskPriority, TaskStatus } from "../store/useTasksStore";

const columns: { title: string; status: TaskStatus }[] = [
  { title: "חדש", status: "todo" },
  { title: "בעבודה", status: "inProgress" },
  { title: "סגור", status: "done" },
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
  const { deleteTask, updateTask } = useTasksStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const isDone = task.status === "done";

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", task.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      className={`group cursor-grab rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 active:cursor-grabbing hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] ${
        task.status === "inProgress" ? "border-r-4 border-r-secondary" : ""
      } ${isDone ? "bg-white/60 opacity-80 grayscale-[0.4]" : ""}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className={`rounded px-2 py-1 text-label-caps ${priorityStyles[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>

        <div className="flex items-center">
          <button
            className="mr-2 text-slate-300 opacity-0 transition-opacity hover:text-secondary group-hover:opacity-100"
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            aria-label="עריכת משימה"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>

          <button
            className="text-slate-300 opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
            type="button"
            onClick={() => deleteTask(task.id)}
            aria-label="מחיקת משימה"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </div>

      {!isEditing ? (
        <>
          <h4 className={`mb-4 text-body-md text-on-surface ${isDone ? "line-through" : ""}`}>
            {task.title}
          </h4>

          <div className="mb-4 flex items-center text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined ml-1 text-[18px]">calendar_today</span>
            {task.dueDate}
          </div>
        </>
      ) : (
        <div className="mb-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm"
            placeholder="כותרת"
          />

          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm"
            placeholder="תאריך"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm"
          >
            <option value="low">נמוך</option>
            <option value="medium">בינוני</option>
            <option value="high">גבוה</option>
          </select>

          <button
            className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white"
            onClick={() => {
              updateTask(task.id, { title, dueDate, priority });
              setIsEditing(false);
            }}
            type="button"
          >
            שמור
          </button>
        </div>
      )}
    </div>
  );
}

function AddTaskModal({ onClose }: { onClose: () => void }) {
  const { addTask } = useTasksStore();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    addTask(title, status, dueDate, priority);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 p-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-outline-variant bg-white p-card-padding shadow-[0px_20px_60px_rgba(0,0,0,0.18)]"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-h2 text-primary">הוספת משימה</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              צור משימה חדשה ובחר לאיזו עמודה היא תיכנס.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="שם המשימה"
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
            autoFocus
          />

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
          />

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
          >
            <option value="low">עדיפות נמוכה</option>
            <option value="medium">עדיפות בינונית</option>
            <option value="high">עדיפות גבוהה</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
          >
            <option value="todo">חדש</option>
            <option value="inProgress">בעבודה</option>
            <option value="done">סגור</option>
          </select>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-outline-variant py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            ביטול
          </button>

          <button
            type="submit"
            className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
          >
            הוסף משימה
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TasksPage() {
  const { tasks, moveTask } = useTasksStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeTasks = tasks.filter((task) => task.status !== "done").length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const urgentTasks = tasks.filter((task) => task.priority === "high" && task.status !== "done").length;

  const stats = [
    { label: "משימות פעילות", value: String(activeTasks).padStart(2, "0") },
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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            הוסף משימה
          </button>
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

                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const taskId = event.dataTransfer.getData("text/plain");
                    if (taskId) {
                      moveTask(taskId, column.status);
                    }
                  }}
                  className="flex min-h-[360px] flex-1 flex-col gap-4 rounded-2xl border-2 border-dashed border-transparent bg-slate-50/60 p-3 transition-colors hover:border-secondary/20"
                >
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="flex min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/50 text-sm text-on-surface-variant">
                      אין משימות בעמודה הזו
                    </div>
                  )}
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
        {isAddModalOpen && (
          <AddTaskModal onClose={() => setIsAddModalOpen(false)} />
        )}
      </div>
    </main>
  );
}