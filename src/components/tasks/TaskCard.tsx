import { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import { useTasksStore } from "../../store/useTasksStore";
import type { Task } from "../../store/useTasksStore";

type TaskCardProps = {
  task: Task;
  isHighlighted?: boolean;
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
  completed: {
    label: "הושלם",
    classes: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  },
};

export default function TaskCard({
  task,
  isHighlighted,
}: TaskCardProps) {
  const { deleteTask } = useTasksStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const priority = priorityMap[task.priority] ?? priorityMap.medium;
  const isDone = task.status === "done";

  return (
    <div
      id={`task-${task.id}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", task.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      className={`group rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] ${
        task.status === "inProgress" ? "border-r-4 border-r-secondary" : ""
      } ${isDone ? "bg-white/60 opacity-80 grayscale-[0.4]" : ""} ${
        isHighlighted ? "ring-2 ring-secondary ring-offset-2" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span
          className={`rounded px-2 py-1 text-label-caps font-label-caps ${priority.classes}`}
        >
          {priority.label}
        </span>

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
            onClick={() => deleteTask(task.id)}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>

        </div>
      </div>

      <h4
        className={`mb-4 text-body-md font-h3 text-on-surface ${
          isDone ? "line-through" : ""
        }`}
      >
        {task.title}
      </h4>

      {task.dueDate && (
        <div className="flex items-center text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined ml-1 text-[18px]">
            calendar_today
          </span>
          {task.dueDate}
        </div>
      )}
      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}