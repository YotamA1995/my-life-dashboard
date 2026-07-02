import { useState } from "react";
import AddTaskModal from "../components/tasks/AddTaskModal";
import KanbanColumn from "../components/tasks/KanbanColumn";
import TasksStats from "../components/tasks/TasksStats";
import TasksInsights from "../components/tasks/TasksInsights";
import TasksToolbar from "../components/tasks/TasksToolbar";
import { taskColumns } from "../components/tasks/tasksColumns";
import { useTasksStore } from "../store/useTasksStore";
import type {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../store/useTasksStore";


export default function TasksPage() {
  const { tasks, moveTask } = useTasksStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "all">("all");

  const filteredTasks = tasks.filter((task) => {
    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch = normalizedSearch
      ? task.title.toLowerCase().includes(normalizedSearch)
      : true;

    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;

    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    const matchesCategory =
      selectedCategory === "all" || task.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  function resetFilters() {
    setSearch("");
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSelectedCategory("all");
  }


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

        <TasksToolbar
          search={search}
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          selectedCategory={selectedCategory}
          onSearchChange={setSearch}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
          onCategoryChange={setSelectedCategory}
          onReset={resetFilters}
        />

        {/* Kanban */}
        <section className="mb-8 flex gap-gutter overflow-x-auto pb-8">
          {taskColumns.map((column) => {
            const columnTasks = filteredTasks.filter(
              (task) => task.status === column.status,
            );

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