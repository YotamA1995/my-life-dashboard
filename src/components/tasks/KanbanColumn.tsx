import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../../store/useTasksStore";

type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  highlightedTaskId: string | null;
  onDropTask: (taskId: string, newStatus: TaskStatus) => void;
};

export default function KanbanColumn({
  title,
  status,
  tasks,
  highlightedTaskId,
  onDropTask,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

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
        {tasks.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-low px-4 text-center text-body-sm text-on-surface-variant">
            אין משימות בעמודה הזו כרגע
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isHighlighted={highlightedTaskId === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
