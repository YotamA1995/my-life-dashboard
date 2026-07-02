import type {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../../store/useTasksStore";

type TasksToolbarProps = {
  search: string;
  selectedStatus: TaskStatus | "all";
  selectedPriority: TaskPriority | "all";
  selectedCategory: TaskCategory | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "all") => void;
  onPriorityChange: (value: TaskPriority | "all") => void;
  onCategoryChange: (value: TaskCategory | "all") => void;
  onReset: () => void;
};

export default function TasksToolbar({
  search,
  selectedStatus,
  selectedPriority,
  selectedCategory,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onReset,
}: TasksToolbarProps) {
  return (
    <section className="mb-8 rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>

            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="חיפוש משימה..."
              className="w-full rounded-xl border border-outline-variant bg-white py-3 pr-11 pl-4 text-sm outline-none transition-all focus:ring-2 focus:ring-secondary"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(event) =>
              onStatusChange(event.target.value as TaskStatus | "all")
            }
            className="rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-secondary"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="todo">חדש</option>
            <option value="inProgress">בעבודה</option>
            <option value="done">סגור</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(event) =>
              onPriorityChange(event.target.value as TaskPriority | "all")
            }
            className="rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-secondary"
          >
            <option value="all">כל העדיפויות</option>
            <option value="low">נמוכה</option>
            <option value="medium">בינונית</option>
            <option value="high">גבוהה</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(event) =>
              onCategoryChange(event.target.value as TaskCategory | "all")
            }
            className="rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-secondary"
          >
            <option value="all">כל התחומים</option>
            <option value="personal">אישי</option>
            <option value="work">עבודה</option>
            <option value="security">ביטחון / מלונות</option>
            <option value="project">פרויקט</option>
            <option value="home">בית</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-outline-variant px-5 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          נקה פילטרים
        </button>
      </div>
    </section>
  );
}