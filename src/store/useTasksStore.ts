import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TaskStatus = "todo" | "inProgress" | "done";

export type TaskPriority = "low" | "medium" | "high" | "completed";

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
};

type TasksStore = {
  tasks: Task[];

  addTask: (
    title: string,
    status?: TaskStatus,
    dueDate?: string,
    priority?: TaskPriority,
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
    dueDate: "2026-10-12",
    status: "todo",
    priority: "medium",
  },
  {
    id: "task-2",
    title: "ארכוב נכסי פרויקט 2022",
    dueDate: "2026-10-20",
    status: "todo",
    priority: "low",
  },
  {
    id: "task-3",
    title: "קליטת לקוח: אינטגרציית חבילת שירותים מקצועית",
    dueDate: "2026-10-10",
    status: "inProgress",
    priority: "high",
  },
  {
    id: "task-4",
    title: "סקירת פרוטוקולי אבטחת מערכת",
    dueDate: "2026-10-14",
    status: "inProgress",
    priority: "medium",
  },
  {
    id: "task-5",
    title: "אימות תיעוד API",
    dueDate: "2026-10-08",
    status: "todo",
    priority: "low",
  },
  {
    id: "task-6",
    title: "פגישת סנכרון רבעונית",
    dueDate: "2026-10-05",
    status: "done",
    priority: "completed",
  },
  {
    id: "task-7",
    title: "טיוטת ספר עובדים גרסה 2.1",
    dueDate: "2026-10-01",
    status: "done",
    priority: "completed",
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

function normalizeTask(task: Task): Task {
  const status = normalizeTaskStatus(task.status);

  return {
    ...task,
    dueDate: normalizeTaskDueDate(task.dueDate),
    status,
    priority: normalizeTaskPriority(task.priority, status),
  };
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: initialTasks.map(normalizeTask),

      addTask(title, status = "todo", dueDate, priority = "medium") {
        const cleanTitle = title.trim();

        if (!cleanTitle) {
          return;
        }

        const normalizedStatus = normalizeTaskStatus(status);

        const newTask: Task = {
          id: createTaskId(),
          title: cleanTitle,
          dueDate: normalizeTaskDueDate(dueDate),
          status: normalizedStatus,
          priority: normalizeTaskPriority(priority, normalizedStatus),
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
              dueDate: normalizeTaskDueDate(updates.dueDate ?? task.dueDate),
              priority: normalizeTaskPriority(
                updates.priority ?? task.priority,
                nextStatus,
              ),
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
      version: 2,
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

        const state = persistedState as { tasks?: Task[] };

        return {
          tasks: Array.isArray(state.tasks)
            ? state.tasks.map(normalizeTask)
            : initialTasks.map(normalizeTask),
        };
      },
    },
  ),
);