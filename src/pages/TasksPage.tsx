import { useState } from "react";
import AddTaskModal from "../components/tasks/AddTaskModal";
import KanbanColumn from "../components/tasks/KanbanColumn";
import TasksStats from "../components/tasks/TasksStats";
import TasksInsights from "../components/tasks/TasksInsights";
import TasksToolbar from "../components/tasks/TasksToolbar";
import TasksBackupActions from "../components/tasks/TasksBackupActions";
import { taskColumns } from "../components/tasks/tasksColumns";
import { useTasksStore } from "../store/useTasksStore";
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../store/useTasksStore";
import { isOverdue } from "../utils/dateUtils";

function isTaskOverdue(task: { dueDate: string; status: TaskStatus }) {
  if (task.status === "done") {
    return false;
  }

  return isOverdue(task.dueDate);
}

type Notice = {
  message: string;
  tone: "success" | "error";
  deletedTask?: Task;
};

export default function TasksPage() {
  const {
    tasks,
    moveTask,
    deleteTask,
    restoreTask,
    replaceTasks,
  } = useTasksStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">(
    "all",
  );
  const [selectedPriority, setSelectedPriority] = useState<
    TaskPriority | "all"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<
    TaskCategory | "all"
  >("all");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const normalizedSearch = search.trim().toLowerCase();

    const searchableText = `${task.title} ${task.description}`.toLowerCase();

    const matchesSearch = normalizedSearch
      ? searchableText.includes(normalizedSearch)
      : true;

    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;

    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    const matchesCategory =
      selectedCategory === "all" || task.category === selectedCategory;

    const matchesOverdue = !showOverdueOnly || isTaskOverdue(task);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory &&
      matchesOverdue
    );
  });

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedStatus !== "all" ||
    selectedPriority !== "all" ||
    selectedCategory !== "all" ||
    showOverdueOnly;

  const hasNoFilteredTasks = filteredTasks.length === 0;

  function resetFilters() {
    setSearch("");
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSelectedCategory("all");
    setShowOverdueOnly(false);
  }

  function handleDeleteTask(taskId: string) {
    const deletedTask = deleteTask(taskId);

    if (!deletedTask) {
      return;
    }

    setNotice({
      message: `המשימה “${deletedTask.title}” נמחקה`,
      tone: "success",
      deletedTask,
    });
  }

  function handleUndoDelete() {
    if (!notice?.deletedTask) {
      return;
    }

    restoreTask(notice.deletedTask);
    setNotice({ message: "המשימה שוחזרה", tone: "success" });
  }

  return (
    <main className="min-h-screen bg-surface px-4 pt-20 pb-8 text-on-surface sm:px-6 sm:pb-10 lg:px-8 lg:pt-24 lg:pb-12">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface sm:text-h1">מרכז ניהול משימות</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              נהל משימות, עקוב אחרי סטטוס, והעבר עבודה בין שלבים.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <TasksBackupActions
              tasks={tasks}
              onImport={replaceTasks}
              onMessage={(message, tone) => setNotice({ message, tone })}
            />

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              הוסף משימה
            </button>
          </div>
        </section>

        <TasksStats tasks={tasks} />

        <TasksToolbar
          search={search}
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          selectedCategory={selectedCategory}
          showOverdueOnly={showOverdueOnly}
          onSearchChange={setSearch}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
          onCategoryChange={setSelectedCategory}
          onOverdueToggle={() =>
            setShowOverdueOnly((currentValue) => !currentValue)
          }
          onReset={resetFilters}
        />

        {/* Kanban */}
        {hasNoFilteredTasks && hasActiveFilters ? (
          <section className="mb-8 rounded-2xl border border-dashed border-outline-variant bg-white px-6 py-10 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant/70">
              filter_alt_off
            </span>
            <h3 className="mt-3 text-h3 text-on-surface">
              לא נמצאו משימות שמתאימות לסינון
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-body-sm leading-6 text-on-surface-variant">
              נסה לשנות את החיפוש או לנקות את הפילטרים כדי להציג שוב את כל
              המשימות.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              נקה פילטרים
            </button>
          </section>
        ) : (
          <section className="mb-8 flex flex-col gap-6 pb-4 lg:flex-row lg:gap-gutter lg:overflow-x-auto lg:pb-8">
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
                  onDeleteTask={handleDeleteTask}
                />
              );
            })}
          </section>
        )}

        <TasksInsights tasks={tasks} />
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

        {notice && (
          <div
            role="status"
            className={`fixed right-4 bottom-4 left-4 z-[120] flex max-w-md items-center gap-3 rounded-xl px-4 py-4 text-sm font-semibold text-white shadow-2xl sm:right-auto sm:bottom-6 sm:left-6 sm:gap-4 sm:px-5 ${
              notice.tone === "error" ? "bg-error" : "bg-primary"
            }`}
          >
            <span>{notice.message}</span>

            {notice.deletedTask && (
              <button
                type="button"
                onClick={handleUndoDelete}
                className="rounded-lg bg-white/15 px-3 py-1.5 hover:bg-white/25"
              >
                ביטול מחיקה
              </button>
            )}

            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="סגור הודעה"
              className="rounded-full p-1 text-white/80 hover:bg-white/15 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
