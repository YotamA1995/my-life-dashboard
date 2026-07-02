import { useState } from "react";
import type { FormEvent } from "react";
import { useTasksStore } from "../../store/useTasksStore";
import type { TaskCategory, TaskPriority, TaskStatus } from "../../store/useTasksStore";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

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
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(getTodayDate());
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const [status, setStatus] = useState<TaskStatus>("todo");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const normalizedDueDate = dueDate || getTodayDate();

    const newTaskId = addTask(
      title,
      status,
      normalizedDueDate,
      priority,
      category,
      description,
    );

    onClose();

    if (!newTaskId) {
      return;
    }

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-primary/40 p-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="max-h-[calc(100vh-48px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-outline-variant bg-white p-card-padding shadow-[0px_20px_60px_rgba(0,0,0,0.18)]"
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
          <div className="flex flex-col gap-2">
            <label className="text-label-lg font-medium text-on-surface">
              שם המשימה
            </label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="לדוגמה: בדיקת ציוד חירום"
              className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-lg font-medium text-on-surface">
              תיאור המשימה
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="הוסף פירוט, הערות או הקשר למשימה"
              rows={3}
              className="w-full resize-none rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-lg font-medium text-on-surface">
              תאריך יעד
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-lg font-medium text-on-surface">
              סטטוס
            </label>

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

          {status !== "done" && (
            <div className="flex flex-col gap-2">
              <label className="text-label-lg font-medium text-on-surface">
                רמת עדיפות
              </label>

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
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-label-lg font-medium text-on-surface">
              תחום
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TaskCategory)
              }
              className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-body-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-secondary"
            >
              <option value="personal">אישי</option>
              <option value="work">עבודה</option>
              <option value="security">ביטחון / מלונות</option>
              <option value="project">פרויקט</option>
              <option value="home">בית</option>
            </select>
          </div>
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