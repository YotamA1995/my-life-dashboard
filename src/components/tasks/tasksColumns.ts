import type { TaskStatus } from "../../store/useTasksStore";

export const taskColumns: {
  title: string;
  status: TaskStatus;
}[] = [
  {
    title: "חדש",
    status: "todo",
  },
  {
    title: "בעבודה",
    status: "inProgress",
  },
  {
    title: "סגור",
    status: "done",
  },
];
