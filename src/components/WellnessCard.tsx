import type { Task, TaskStatus } from "../store/useTasksStore";
import { isOverdue } from "../utils/dateUtils";

type WellnessCardProps = {
  tasks: Task[];
};

type DayStatus = {
  label: string;
  value: string;
  unit: string;
  icon: string;
  color: string;
  bg: string;
};

function isTaskOverdue(task: { dueDate: string; status: TaskStatus }) {
  if (task.status === "done") {
    return false;
  }

  return isOverdue(task.dueDate);
}

function getTodayStatus(tasks: Task[]): DayStatus[] {
  const activeTasks = tasks.filter((task) => task.status !== "done").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "inProgress",
  ).length;
  const overdueTasks = tasks.filter(isTaskOverdue).length;
  const highPriorityTasks = tasks.filter(
    (task) => task.status !== "done" && task.priority === "high",
  ).length;

  return [
    {
      label: "פתוחות",
      value: activeTasks.toString(),
      unit: "משימות",
      icon: "checklist",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "בעבודה",
      value: inProgressTasks.toString(),
      unit: "כרגע",
      icon: "pending_actions",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "באיחור",
      value: overdueTasks.toString(),
      unit: overdueTasks > 0 ? "לטיפול" : "תקין",
      icon: "warning",
      color: overdueTasks > 0 ? "text-red-500" : "text-teal-600",
      bg: overdueTasks > 0 ? "bg-red-50" : "bg-teal-50",
    },
    {
      label: "דחופות",
      value: highPriorityTasks.toString(),
      unit: "עדיפות גבוהה",
      icon: "priority_high",
      color: highPriorityTasks > 0 ? "text-red-500" : "text-slate-500",
      bg: highPriorityTasks > 0 ? "bg-red-50" : "bg-slate-100",
    },
  ];
}

function getStatusSummary(tasks: Task[]) {
  const overdueTasks = tasks.filter(isTaskOverdue).length;
  const highPriorityTasks = tasks.filter(
    (task) => task.status !== "done" && task.priority === "high",
  ).length;
  const activeTasks = tasks.filter((task) => task.status !== "done").length;

  if (overdueTasks > 0) {
    return "יש משימות באיחור שכדאי לסגור לפני שמתקדמים לדברים חדשים.";
  }

  if (highPriorityTasks > 0) {
    return "אין איחורים, אבל יש משימות בעדיפות גבוהה שכדאי לקדם היום.";
  }

  if (activeTasks > 0) {
    return "המצב נראה מאוזן. אפשר להתמקד במשימה הקרובה ביותר לפי תאריך יעד.";
  }

  return "אין כרגע משימות פתוחות. זמן טוב לתכנן קדימה או לסגור קצוות.";
}

export default function WellnessCard({ tasks }: WellnessCardProps) {
  const stats = getTodayStatus(tasks);
  const statusSummary = getStatusSummary(tasks);

  return (
    <section className="col-span-12 rounded-xl border border-slate-200 bg-white/90 p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] lg:col-span-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-h3 text-primary">מצב היום</h3>
          <p className="text-sm text-slate-500">
            עומס תפעולי לפי המשימות שלך
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg}`}
            >
              <span
                className={`material-symbols-outlined ${item.color}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {item.icon}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-400">
                {item.label}
              </p>
              <p className="text-lg font-bold text-primary">
                {item.value}{" "}
                <span className="text-xs font-normal">{item.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
        {statusSummary}
      </div>
    </section>
  );
}
