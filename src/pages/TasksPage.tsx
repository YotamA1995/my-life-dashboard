import { useState } from "react";
import AddTaskModal from "../components/tasks/AddTaskModal";
import KanbanColumn from "../components/tasks/KanbanColumn";
import TasksStats from "../components/tasks/TasksStats";
import TasksInsights from "../components/tasks/TasksInsights";
import { taskColumns } from "../components/tasks/tasksColumns";
import { useTasksStore } from "../store/useTasksStore";


export default function TasksPage() {
  const { tasks, moveTask } = useTasksStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);


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

        <TasksStats tasks={tasks} />

        {/* Kanban */}
        <section className="mb-8 flex gap-gutter overflow-x-auto pb-8">
          {taskColumns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.status);

            return (
              <KanbanColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={columnTasks}
                highlightedTaskId={highlightedTaskId}
                onDropTask={moveTask}
              />
            );
          })}
        </section>

        <TasksInsights />
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