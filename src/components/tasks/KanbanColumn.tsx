import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../../store/useTasksStore";


type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  highlightedTaskId: string | null;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
};

const emptyStateByStatus: Record<
  TaskStatus,
  { icon: string; title: string; description: string }
> = {
  todo: {
    icon: "inbox",
    title: "אין משימות חדשות",
    description: "משימות חדשות שתיצור יופיעו כאן עד שתתחיל לטפל בהן.",
  },
  inProgress: {
    icon: "pending_actions",
    title: "אין משימות בעבודה",
    description: "גרור לכאן משימה כדי לסמן שהטיפול בה התחיל.",
  },
  done: {
    icon: "task_alt",
    title: "אין משימות סגורות",
    description: "משימות שתסגור יופיעו כאן עם תאריך ההשלמה שלהן.",
  },
};

const dropLabelByStatus: Record<TaskStatus, string> = {
  todo: "שחרר כאן כדי להעביר לחדש",
  inProgress: "שחרר כאן כדי להעביר לבעבודה",
  done: "שחרר כאן כדי לסגור את המשימה",
};

export default function KanbanColumn({
  title,
  status,
  tasks,
  highlightedTaskId,
  onDropTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const emptyState = emptyStateByStatus[status];
  const dropLabel = dropLabelByStatus[status];

  return (
    <div className="flex w-80 flex-shrink-0 flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h2 className="font-h3 text-h3 text-on-surface">{title}</h2>
          <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-body-sm font-medium text-on-surface-variant">
            {tasks.length}
          </span>
        </div>

        <span className="material-symbols-outlined cursor-pointer text-slate-400">
          more_horiz
        </span>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => {
          setIsDragOver(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragOver(false);

          const taskId = event.dataTransfer.getData("text/plain");

          if (!taskId) {
            return;
          }

          onDropTask(taskId, status);
        }}
        className={`kanban-scroll min-h-64 flex-1 space-y-4 rounded-2xl border border-dashed p-2 transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-transparent bg-transparent"
        } overflow-y-auto`}
      >
        {isDragOver && (
          <div className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-body-sm font-semibold text-primary">
            <span className="material-symbols-outlined text-[18px]">
              move_down
            </span>
            {dropLabel}
          </div>
        )}

        {tasks.length === 0 ? (
          <div className={`flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-8 text-center text-on-surface-variant transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-outline-variant bg-surface-container-low"
          }`}>
            <span className="material-symbols-outlined mb-3 text-[32px] text-on-surface-variant/70">
              {emptyState.icon}
            </span>
            <p className="text-body-md font-semibold text-on-surface">
              {emptyState.title}
            </p>
            <p className="mt-2 max-w-56 text-body-sm leading-6">
              {emptyState.description}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isHighlighted={highlightedTaskId === task.id}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
