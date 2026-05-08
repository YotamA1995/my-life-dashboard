

import { useState } from "react";
import type { FormEvent } from "react";
import { useTasksStore } from "../../store/useTasksStore";
import type { TaskPriority, TaskStatus } from "../../store/useTasksStore";

type AddTaskModalProps = {
  onClose: () => void;
  onTaskCreated: (taskId: string) => void;
};

export default function AddTaskModal({
  onClose,
  onTaskCreated,
}: AddTaskModalProps) {
  const { addTask } = useTasksStore();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const newTaskId = addTask(title, status, dueDate, priority);

    onClose();

    setTimeout(() => {
      const element = document.getElementById(`task-${newTaskId}`);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        onTaskCreated(newTaskId);
      }
    }, 100);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 p-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-outline-variant bg-white p-card-padding shadow-[0px_20px_60px_rgba(0,0,0,0.18)]"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-h2 text-primary">הוספת משימה</h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              צור משימה חדשה ובחר לאיזו עמודה היא תיכנס.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="שם המשימה"
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
            autoFocus
          />

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
          />

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
          >
            <option value="low">עדיפות נמוכה</option>
            <option value="medium">עדיפות בינונית</option>
            <option value="high">עדיפות גבוהה</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
            className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
          >
            <option value="todo">חדש</option>
            <option value="inProgress">בעבודה</option>
            <option value="done">סגור</option>
          </select>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-outline-variant py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            ביטול
          </button>

          <button
            type="submit"
            className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
          >
            הוסף משימה
          </button>
        </div>
      </form>
    </div>
  );
}