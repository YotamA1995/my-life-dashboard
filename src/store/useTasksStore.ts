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