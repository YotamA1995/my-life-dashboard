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
  return (
    <div className="flex w-80 flex-shrink-0 flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="font-h3 text-h3 text-on-surface">
          {title}
          <span className="mr-2 text-body-sm font-normal text-on-surface-variant">
            {tasks.length}
          </span>
        </h2>

        <span className="material-symbols-outlined cursor-pointer text-slate-400">
          more_horiz
        </span>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();

          const taskId = event.dataTransfer.getData("text/plain");

          if (!taskId) {
            return;
          }

          onDropTask(taskId, status);
        }}
        className="kanban-scroll flex-1 space-y-4 overflow-y-auto pl-2"
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isHighlighted={highlightedTaskId === task.id}
          />
        ))}
      </div>
    </div>
  );
}
