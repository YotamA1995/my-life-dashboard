import { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import type { Task } from "../../store/useTasksStore";
import {
  APP_TIME_ZONE,
  formatTaskDate,
  getDateKey,
  isOverdue,
  shiftDateKey,
} from "../../utils/dateUtils";

type TaskCardProps = {
  task: Task;
  isHighlighted?: boolean;
  onDelete: (taskId: string) => void;
};

const priorityMap = {
  low: {
    label: "נמוך",
    classes: "bg-blue-50 text-blue-700",
  },
  medium: {
    label: "בינוני",
    classes: "bg-amber-50 text-amber-700",
  },
  high: {
    label: "גבוה",
    classes: "bg-red-50 text-red-700",
  },
};

const categoryMap = {
  personal: {
    label: "אישי",
    icon: "person",
    classes: "bg-slate-100 text-slate-700",
  },
  work: {
    label: "עבודה",
    icon: "work",
    classes: "bg-blue-50 text-blue-700",
  },
  security: {
    label: "ביטחון / מלונות",
    icon: "admin_panel_settings",
    classes: "bg-emerald-50 text-emerald-700",
  },
  project: {
    label: "פרויקט",
    icon: "rocket_launch",
    classes: "bg-purple-50 text-purple-700",
  },
  home: {
    label: "בית",
    icon: "home",
    classes: "bg-orange-50 text-orange-700",
  },
};

function formatCompletedAt(completedAt?: string) {
  if (!completedAt) {
    return null;
  }

  const completedDate = new Date(completedAt);

  if (Number.isNaN(completedDate.getTime())) {
    return null;
  }

  const today = new Date();
  const todayDateKey = getDateKey(today);

  if (getDateKey(completedDate) === todayDateKey) {
    return "הושלם היום";
  }

  if (getDateKey(completedDate) === shiftDateKey(todayDateKey, -1)) {
    return "הושלם אתמול";
  }

  return `הושלם ב-${new Intl.DateTimeFormat("he-IL", {
    timeZone: APP_TIME_ZONE,
    day: "2-digit",
    month: "long",
  }).format(completedDate)}`;
}

export default function TaskCard({
  task,
  isHighlighted,
  onDelete,
}: TaskCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const priority = priorityMap[task.priority] ?? priorityMap.medium;
  const category = categoryMap[task.category] ?? categoryMap.personal;
  const isDone = task.status === "done";
  const overdue = isOverdue(task.dueDate) && !isDone;
  const completedLabel = formatCompletedAt(task.completedAt);

  return (
    <div
      id={`task-${task.id}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", task.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      className={`group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] ${
        task.status === "inProgress" ? "border-r-4 border-r-secondary" : ""
      } ${isDone ? "border-tertiary/30 bg-surface-container-low" : ""} ${
        isHighlighted ? "ring-2 ring-secondary ring-offset-2" : ""
      }`}
    >
      {isDone && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-tertiary" />
      )}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-2 py-1 text-label-caps font-label-caps ${priority.classes}`}
          >
            {priority.label}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-1 text-label-caps font-label-caps ${category.classes}`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {category.icon}
            </span>
            {category.label}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">
              edit
            </span>
          </button>

          <button
            onClick={() => onDelete(task.id)}
            aria-label={`מחק את המשימה ${task.title}`}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>

        </div>
      </div>

      <h4
        className={`mb-2 text-body-md font-h3 ${
          isDone
            ? "text-on-surface-variant line-through decoration-tertiary decoration-2"
            : "text-on-surface"
        }`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p
          className={`mb-4 line-clamp-2 text-body-sm ${
            isDone ? "text-on-surface-variant/80" : "text-on-surface-variant"
          }`}
        >
          {task.description}
        </p>
      )}

      <div className="flex flex-col gap-2 text-body-sm">
        <div
          className={`flex items-center ${
            overdue ? "text-red-600" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined ml-1 text-[18px]">
            {overdue ? "warning" : "calendar_today"}
          </span>
          {formatTaskDate(task.dueDate)}
        </div>

        {completedLabel && (
          <div className="inline-flex w-fit items-center rounded-lg bg-tertiary-fixed px-2 py-1 text-on-tertiary-fixed-variant">
            <span className="material-symbols-outlined ml-1 text-[18px]">
              task_alt
            </span>
            {completedLabel}
          </div>
        )}
      </div>
      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
