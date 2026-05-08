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
    dueDate: "12 באוקטובר 2023",
    status: "todo",
    priority: "medium",
  },
  {
    id: "task-2",
    title: "ארכוב נכסי פרויקט 2022",
    dueDate: "20 באוקטובר 2023",
    status: "todo",
    priority: "low",
  },
  {
    id: "task-3",
    title: "קליטת לקוח: אינטגרציית חבילת שירותים מקצועית",
    dueDate: "10 באוקטובר 2023",
    status: "inProgress",
    priority: "high",
  },
  {
    id: "task-4",
    title: "סקירת פרוטוקולי אבטחת מערכת",
    dueDate: "14 באוקטובר 2023",
    status: "inProgress",
    priority: "medium",
  },
  {
    id: "task-5",
    title: "אימות תיעוד API",
    dueDate: "08 באוקטובר 2023",
    status: "todo",
    priority: "low",
  },
  {
    id: "task-6",
    title: "פגישת סנכרון רבעונית",
    dueDate: "05 באוקטובר 2023",
    status: "done",
    priority: "completed",
  },
  {
    id: "task-7",
    title: "טיוטת ספר עובדים גרסה 2.1",
    dueDate: "01 באוקטובר 2023",
    status: "done",
    priority: "completed",
  },
];

function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: initialTasks,

      addTask(
        title,
        status = "todo",
        dueDate,
        priority = "medium",
      ) {
        const cleanTitle = title.trim();

        if (!cleanTitle) {
          return;
        }

        const newTask: Task = {
          id: createTaskId(),
          title: cleanTitle,
          dueDate: dueDate || "היום",
          status,
          priority: status === "done" ? "completed" : priority,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        return newTask.id;
      },

      moveTask(taskId, status) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status,
                  priority:
                    status === "done" ? "completed" : task.priority,
                }
              : task,
          ),
        }));
      },

      updateTask(taskId, updates) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                }
              : task,
          ),
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
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
      }),
    },
  ),
);