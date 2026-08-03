import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { normalizeDateKey } from "../utils/dateUtils";

export type TaskStatus = "todo" | "inProgress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type TaskCategory = "work" | "home" | "project" | "personal" | "security";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

type StoredTask = Partial<Task> & Pick<Task, "id" | "title">;

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
    updates: Partial<
      Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">
    >,
  ) => void;

  deleteTask: (taskId: string) => Task | undefined;

  restoreTask: (task: Task) => void;

  replaceTasks: (tasks: unknown) => number | undefined;
};

const initialTasks: StoredTask[] = [
  {
    id: "task-1",
    title: "בדיקת לחץ הידרנטים בגג גימנסיה",
    description: "לעקוב מול דניאל / תחזוקה אחרי בעיית הלחץ בהידרנטים ולוודא טיפול עד לסגירה מלאה.",
    dueDate: "2026-07-05",
    status: "todo",
    priority: "high",
    category: "security",
  },
  {
    id: "task-2",
    title: "מעקב ליקויי דק בגג אלברטו",
    description: "לוודא שהדק הרעוע באזור הבריכה מטופל, במיוחד בצד המזרחי ובאזור המקלחת.",
    dueDate: "2026-07-06",
    status: "inProgress",
    priority: "high",
    category: "security",
  },
  {
    id: "task-3",
    title: "השלמת נוהל הכנסת אוכל לבריכה",
    description: "לסגור נוסח סופי וברור למחלקת ביטחון לגבי מה מותר ומה אסור להכניס לבריכה ומי מוסמך לאשר חריגים.",
    dueDate: "2026-07-07",
    status: "todo",
    priority: "medium",
    category: "work",
  },
  {
    id: "task-4",
    title: "ריכוז משימות פתוחות למלון אלברטו",
    description: "לאסוף במקום אחד משימות פתוחות מול תחזוקה, פרויקטים, בריכה, מעלית וקבלנים.",
    dueDate: "2026-07-08",
    status: "todo",
    priority: "medium",
    category: "work",
  },
  {
    id: "task-5",
    title: "המשך פיתוח מודול המשימות בדשבורד",
    description: "להשלים הצגת תיאורים, פילטרים, בדיקות build/lint והכנה לקומיט הבא.",
    dueDate: "2026-07-04",
    status: "inProgress",
    priority: "medium",
    category: "project",
  },
  {
    id: "task-6",
    title: "בדיקת תוקף ציוד חירום ועזרה ראשונה",
    description: "לעבור על ציוד עזרה ראשונה, דפיברילטורים וציוד חירום במלונות ולוודא שאין פריטים פגי תוקף.",
    dueDate: "2026-07-10",
    status: "todo",
    priority: "medium",
    category: "security",
  },
  {
    id: "task-7",
    title: "סגירת קומיט אחרי מודול description",
    description: "לאחר שה־build וה־lint עוברים, לבצע קומיט מסודר לשינויים במודול המשימות.",
    dueDate: "2026-07-03",
    status: "todo",
    priority: "low",
    category: "project",
  },
];

function getCurrentTimestamp() {
  return new Date().toISOString();
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
): TaskPriority {
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

function normalizeTimestamp(timestamp: unknown, fallback: string) {
  if (typeof timestamp !== "string") {
    return fallback;
  }

  const parsedDate = new Date(timestamp);

  return Number.isNaN(parsedDate.getTime()) ? fallback : timestamp;
}

function normalizeCompletedAt(
  completedAt: unknown,
  status: TaskStatus,
  fallback: string,
) {
  if (status !== "done") {
    return undefined;
  }

  if (typeof completedAt !== "string") {
    return fallback;
  }

  const parsedDate = new Date(completedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return completedAt;
}

function getTaskCompletionFields(
  task: Task,
  nextStatus: TaskStatus,
  timestamp: string,
) {
  const isMovingToDone = nextStatus === "done";
  const wasAlreadyDone = task.status === "done";

  return {
    status: nextStatus,
    completedAt: isMovingToDone
      ? wasAlreadyDone
        ? task.completedAt ?? timestamp
        : timestamp
      : undefined,
  };
}

export function normalizeTask(task: StoredTask): Task {
  const status = normalizeTaskStatus(task.status);
  const fallbackTimestamp = getCurrentTimestamp();
  const createdAt = normalizeTimestamp(task.createdAt, fallbackTimestamp);
  const updatedAt = normalizeTimestamp(task.updatedAt, createdAt);

  return {
    id: task.id,
    title: task.title.trim(),
    description: normalizeTaskDescription(task.description),
    dueDate: normalizeDateKey(task.dueDate),
    status,
    priority: normalizeTaskPriority(task.priority),
    category: normalizeTaskCategory(task.category),
    createdAt,
    updatedAt,
    completedAt: normalizeCompletedAt(task.completedAt, status, updatedAt),
  };
}

function isStoredTask(value: unknown): value is StoredTask {
  if (!value || typeof value !== "object") {
    return false;
  }

  const task = value as { id?: unknown; title?: unknown };

  return (
    typeof task.id === "string" &&
    task.id.trim().length > 0 &&
    typeof task.title === "string" &&
    task.title.trim().length > 0
  );
}

export function normalizeTasksData(tasks: unknown): Task[] | undefined {
  if (!Array.isArray(tasks) || !tasks.every(isStoredTask)) {
    return undefined;
  }

  return Array.from(
    new Map(
      tasks.map((task) => {
        const normalizedTask = normalizeTask(task);

        return [normalizedTask.id, normalizedTask];
      }),
    ).values(),
  );
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set, get) => ({
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
        const timestamp = getCurrentTimestamp();

        const newTask: Task = {
          id: createTaskId(),
          title: cleanTitle,
          description: normalizeTaskDescription(description),
          dueDate: normalizeDateKey(dueDate),
          status: normalizedStatus,
          priority: normalizeTaskPriority(priority),
          category: normalizeTaskCategory(category),
          createdAt: timestamp,
          updatedAt: timestamp,
          completedAt: normalizeCompletedAt(
            undefined,
            normalizedStatus,
            timestamp,
          ),
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        return newTask.id;
      },

      moveTask(taskId, status) {
        const normalizedStatus = normalizeTaskStatus(status);
        const timestamp = getCurrentTimestamp();

        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) {
              return task;
            }

            return {
              ...task,
              ...getTaskCompletionFields(task, normalizedStatus, timestamp),
              updatedAt: timestamp,
            };
          }),
        }));
      },

      updateTask(taskId, updates) {
        const timestamp = getCurrentTimestamp();

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
              title: updates.title?.trim() || task.title,
              description: normalizeTaskDescription(
                updates.description ?? task.description,
              ),
              dueDate: normalizeDateKey(updates.dueDate ?? task.dueDate),
              priority: normalizeTaskPriority(
                updates.priority ?? task.priority,
              ),
              category: normalizeTaskCategory(updates.category ?? task.category),
              ...getTaskCompletionFields(
                task,
                nextStatus,
                timestamp,
              ),
              updatedAt: timestamp,
            };
          }),
        }));
      },

      deleteTask(taskId) {
        const deletedTask = get().tasks.find((task) => task.id === taskId);

        if (!deletedTask) {
          return;
        }

        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));

        return deletedTask;
      },

      restoreTask(task) {
        const restoredTask = normalizeTask(task);

        set((state) => ({
          tasks: state.tasks.some((item) => item.id === restoredTask.id)
            ? state.tasks
            : [...state.tasks, restoredTask],
        }));
      },

      replaceTasks(tasks) {
        const normalizedTasks = normalizeTasksData(tasks);

        if (!normalizedTasks) {
          return;
        }

        set({ tasks: normalizedTasks });

        return normalizedTasks.length;
      },
    }),
    {
      name: "tasks-storage",
      version: 6,
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

        const state = persistedState as { tasks?: unknown };

        return {
          tasks:
            normalizeTasksData(state.tasks) ?? initialTasks.map(normalizeTask),
        };
      },
    },
  ),
);
