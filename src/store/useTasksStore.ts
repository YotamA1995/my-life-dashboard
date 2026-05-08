import { useSyncExternalStore } from "react";

export type TaskStatus = "todo" | "inProgress" | "done";

export type TaskPriority = "low" | "medium" | "high" | "completed";

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
};

type TasksState = {
  tasks: Task[];
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

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem("tasks");
    if (!raw) return initialTasks;
    return JSON.parse(raw);
  } catch {
    return initialTasks;
  }
}

let state: TasksState = {
  tasks: loadFromStorage(),
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function saveToStorage() {
  try {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  } catch {}
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useTasksStore() {
  const currentState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    tasks: currentState.tasks,

    addTask(
      title: string,
      status: TaskStatus = "todo",
      dueDate?: string,
      priority: TaskPriority = "medium",
    ) {
      const cleanTitle = title.trim();

      if (!cleanTitle) return;

      const newTask: Task = {
        id: createTaskId(),
        title: cleanTitle,
        dueDate: dueDate || "היום",
        status,
        priority: status === "done" ? "completed" : priority,
      };

      state = {
        ...state,
        tasks: [...state.tasks, newTask],
      };

      emitChange();
      saveToStorage();
      return newTask.id;
    },

    moveTask(taskId: string, status: TaskStatus) {
      state = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
                priority: status === "done" ? "completed" : task.priority,
              }
            : task,
        ),
      };

      emitChange();
      saveToStorage();
    },

    updateTask(taskId: string, updates: Partial<Omit<Task, "id">>) {
      state = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...updates,
              }
            : task,
        ),
      };

      emitChange();
      saveToStorage();
    },

    deleteTask(taskId: string) {
      state = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== taskId),
      };

      emitChange();
      saveToStorage();
    },
  };
}