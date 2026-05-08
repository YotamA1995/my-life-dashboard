import { useState } from "react";
import AddTaskModal from "../components/tasks/AddTaskModal";
import KanbanColumn from "../components/tasks/KanbanColumn";
import { useTasksStore } from "../store/useTasksStore";
import type { TaskStatus } from "../store/useTasksStore";

const columns: { title: string; status: TaskStatus }[] = [
  { title: "חדש", status: "todo" },
  { title: "בעבודה", status: "inProgress" },
  { title: "סגור", status: "done" },
];


export default function TasksPage() {
  const { tasks, moveTask } = useTasksStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    moveTask(taskId, newStatus);
  };

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
              <KanbanColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={columnTasks}
                highlightedTaskId={highlightedTaskId}
                onDropTask={handleDropTask}
              />
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
          <AddTaskModal
            onClose={() => setIsAddModalOpen(false)}
            onTaskCreated={(taskId) => {
              setHighlightedTaskId(taskId);

              setTimeout(() => {
                setHighlightedTaskId(null);
              }, 2500);
            }}
          />
        )}
      </div>
    </main>
  );
}