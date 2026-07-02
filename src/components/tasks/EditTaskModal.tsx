import { useState } from "react";
import { useTasksStore } from "../../store/useTasksStore";
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../../store/useTasksStore";
import { Button, Input, Modal } from "../ui";

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
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(
    task.dueDate || getTodayDate(),
  );

  const [status, setStatus] = useState<TaskStatus>(task.status);

  const [priority, setPriority] = useState<TaskPriority>(
    task.priority === "completed" ? "medium" : task.priority,
  );

  const [category, setCategory] = useState<TaskCategory>(task.category);

  function handleSave() {
    if (!title.trim()) {
      return;
    }

    const normalizedDueDate = dueDate || getTodayDate();

    updateTask(task.id, {
      title: title.trim(),
      description,
      dueDate: normalizedDueDate,
      status,
      priority: status === "done" ? "completed" : priority,
      category,
    });

    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="עריכת משימה"
      description="עדכן פרטי משימה קיימת."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            ביטול
          </Button>

          <Button
            type="button"
            className="flex-1"
            onClick={handleSave}
          >
            שמור שינויים
          </Button>
        </>
      }
    >
      <div className="max-h-[calc(100vh-260px)] space-y-4 overflow-y-auto pr-1">
        <Input
          label="שם המשימה"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="הכנס שם משימה"
        />

        <div className="flex flex-col gap-2">
          <label className="text-label-lg font-medium text-on-surface">
            תיאור המשימה
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="הוסף פירוט, הערות או הקשר למשימה"
            rows={3}
            className="resize-none rounded-xl border border-outline-variant bg-surface px-4 py-3 text-body-lg text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Input
          label="תאריך יעד"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />

        <div className="flex flex-col gap-2">
          <label className="text-label-lg font-medium text-on-surface">
            סטטוס
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
            className="h-11 rounded-xl border border-outline-variant bg-surface px-4 text-body-lg text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              className="h-11 rounded-xl border border-outline-variant bg-surface px-4 text-body-lg text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="low">נמוכה</option>
              <option value="medium">בינונית</option>
              <option value="high">גבוהה</option>
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
            className="h-11 rounded-xl border border-outline-variant bg-surface px-4 text-body-lg text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="personal">אישי</option>
            <option value="work">עבודה</option>
            <option value="security">ביטחון / מלונות</option>
            <option value="project">פרויקט</option>
            <option value="home">בית</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}