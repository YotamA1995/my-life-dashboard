import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TaskStatus = "todo" | "inProgress" | "done";

export type TaskPriority = "low" | "medium" | "high" | "completed";

export type TaskCategory = "work" | "home" | "project" | "personal" | "security";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
};

type TasksStore = {
  tasks: Task[];

  addTask: (
    title: string,
    status?: TaskStatus,
    dueDate?: string,
    priority?: TaskPriority,
    category?: TaskCategory,
    description?: string,
  ) => string | undefined;

  moveTask: (taskId: string, status: TaskStatus) => void;

  updateTask: (
    taskId: string,
    updates: Partial<Omit<Task, "id">>,
  ) => void;

  deleteTask: (taskId: string) => void;
};

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "עדכון מבנה הדיווח הפיננסי לרבעון השלישי",
    description: "בדיקת מבנה הנתונים והכנת תצוגה ברורה יותר לדשבורד הכספים.",
    dueDate: "2026-10-12",
    status: "todo",
    priority: "medium",
    category: "work",
  },
  {
    id: "task-2",
    title: "ארכוב נכסי פרויקט 2022",
    description: "סידור חומרים ישנים מהפרויקט והכנה להעברה לארכיון מסודר.",
    dueDate: "2026-10-20",
    status: "todo",
    priority: "low",
    category: "project",
  },
  {
    id: "task-3",
    title: "קליטת לקוח: אינטגרציית חבילת שירותים מקצועית",
    description: "השלמת משימות פתוחות בתהליך הקליטה והגדרת השלבים הבאים מול הגורמים הרלוונטיים.",
    dueDate: "2026-10-10",
    status: "inProgress",
    priority: "high",
    category: "work",
  },
  {
    id: "task-4",
    title: "סקירת פרוטוקולי אבטחת מערכת",
    description: "בדיקת נהלי אבטחה קיימים וזיהוי פערים שדורשים טיפול.",
    dueDate: "2026-10-14",
    status: "inProgress",
    priority: "medium",
    category: "security",
  },
  {
    id: "task-5",
    title: "אימות תיעוד API",
    description: "מעבר על התיעוד הקיים ווידוא שהוא תואם למימוש בפועל.",
    dueDate: "2026-10-08",
    status: "todo",
    priority: "low",
    category: "project",
  },
  {
    id: "task-6",
    title: "פגישת סנכרון רבעונית",
    description: "סיכום סטטוס רבעוני והחלטות להמשך עבודה.",
    dueDate: "2026-10-05",
    status: "done",
    priority: "completed",
    category: "personal",
  },
  {
    id: "task-7",
    title: "טיוטת ספר עובדים גרסה 2.1",
    description: "עדכון טיוטת הנהלים והכנתה לסבב הערות נוסף.",
    dueDate: "2026-10-01",
    status: "done",
    priority: "completed",
    category: "work",
  },
];

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTaskStatus(status: unknown): TaskStatus {
  if (status === "todo" || status === "inProgress" || status === "done") {
    return status;
  }

  return "todo";
}

function normalizeTaskPriority(
  priority: unknown,
  status: TaskStatus,
): TaskPriority {
  if (status === "done") {
    return "completed";
  }

  if (priority === "low" || priority === "medium" || priority === "high") {
    return priority;
  }

  return "medium";
}

function normalizeTaskCategory(category: unknown): TaskCategory {
  if (
    category === "work" ||
    category === "home" ||
    category === "project" ||
    category === "personal" ||
    category === "security"
  ) {
    return category;
  }

  return "personal";
}

function normalizeTaskDescription(description: unknown) {
  if (typeof description !== "string") {
    return "";
  }

  return description.trim();
}

function normalizeTask(task: Partial<Task> & Pick<Task, "id" | "title">): Task {
  const status = normalizeTaskStatus(task.status);

  return {
    ...task,
    description: normalizeTaskDescription(task.description),
    dueDate: normalizeTaskDueDate(task.dueDate),
    status,
    priority: normalizeTaskPriority(task.priority, status),
    category: normalizeTaskCategory(task.category),
  };
}

function normalizeTaskDueDate(dueDate?: string) {
  if (!dueDate || dueDate === "היום") {
    return getTodayDate();
  }

  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (isoDatePattern.test(dueDate)) {
    return dueDate;
  }

  const parsedDate = new Date(dueDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return getTodayDate();
  }

  return parsedDate.toISOString().split("T")[0];
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: initialTasks.map(normalizeTask),

      addTask(
        title,
        status = "todo",
        dueDate,
        priority = "medium",
        category = "personal",
        description = "",
      ) {
        const cleanTitle = title.trim();

        if (!cleanTitle) {
          return;
        }

        const normalizedStatus = normalizeTaskStatus(status);

        const newTask: Task = {
          id: createTaskId(),
          title: cleanTitle,
          description: normalizeTaskDescription(description),
          dueDate: normalizeTaskDueDate(dueDate),
          status: normalizedStatus,
          priority: normalizeTaskPriority(priority, normalizedStatus),
          category: normalizeTaskCategory(category),
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        return newTask.id;
      },

      moveTask(taskId, status) {
        const normalizedStatus = normalizeTaskStatus(status);

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: normalizedStatus,
                  priority:
                    normalizedStatus === "done"
                      ? "completed"
                      : task.priority === "completed"
                        ? "medium"
                        : task.priority,
                }
              : task,
          ),
        }));
      },

      updateTask(taskId, updates) {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) {
              return task;
            }

            const nextStatus = updates.status
              ? normalizeTaskStatus(updates.status)
              : task.status;

            return {
              ...task,
              ...updates,
              status: nextStatus,
              description: normalizeTaskDescription(
                updates.description ?? task.description,
              ),
              dueDate: normalizeTaskDueDate(updates.dueDate ?? task.dueDate),
              priority: normalizeTaskPriority(
                updates.priority ?? task.priority,
                nextStatus,
              ),
              category: normalizeTaskCategory(updates.category ?? task.category),
            };
          }),
        }));
      },

      deleteTask(taskId) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },
    }),
    {
      name: "tasks-storage",
      version: 4,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
      }),
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return {
            tasks: initialTasks.map(normalizeTask),
          };
        }

        const state = persistedState as { tasks?: Array<Partial<Task> & Pick<Task, "id" | "title">> };

        return {
          tasks: Array.isArray(state.tasks)
            ? state.tasks.map(normalizeTask)
            : initialTasks.map(normalizeTask),
        };
      },
    },
  ),
);