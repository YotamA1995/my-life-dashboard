import { useState } from "react";
import { useTasksStore } from "../../store/useTasksStore";
import type { Task, TaskPriority } from "../../store/useTasksStore";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

type EditTaskModalProps = {
  task: Task;
  onClose: () => void;
};

export default function EditTaskModal({
  task,
  onClose,
}: EditTaskModalProps) {
  const { updateTask } = useTasksStore();

  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(
    task.dueDate || getTodayDate(),
  );

  const [priority, setPriority] = useState<TaskPriority>(
    task.priority === "completed" ? "medium" : task.priority,
  );

  function handleSave() {
    if (!title.trim()) {
      return;
    }

    const normalizedDueDate = dueDate || getTodayDate();

    updateTask(task.id, {
      title: title.trim(),
      dueDate: normalizedDueDate,
      priority: task.status === "done" ? "completed" : priority,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-on-surface">
              עריכת משימה
            </h2>

            <p className="mt-1 text-sm text-on-surface-variant">
              עדכן פרטי משימה קיימת.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">
              שם המשימה
            </label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-secondary"
              placeholder="הכנס שם משימה"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">
              תאריך יעד
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-secondary"
            />
          </div>

          {task.status !== "done" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-on-surface">
                רמת עדיפות
              </label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-secondary"
              >
                <option value="low">נמוכה</option>
                <option value="medium">בינונית</option>
                <option value="high">גבוהה</option>
              </select>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            שמור שינויים
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-outline-variant py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}