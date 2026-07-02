import SummaryCard from "../components/SummaryCard";
import ProductivityChart from "../components/ProductivityChart";
import FocusSession from "../components/FocusSession";
import NetworkActivity from "../components/NetworkActivity";
import WellnessCard from "../components/WellnessCard";
import { useTasksStore } from "../store/useTasksStore";
import type { Task, TaskStatus } from "../store/useTasksStore";

function isTaskOverdue(task: { dueDate: string; status: TaskStatus }) {
  if (task.status === "done") {
    return false;
  }

  const dueDate = new Date(task.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function isCompletedToday(task: Task) {
  if (task.status !== "done" || !task.completedAt) {
    return false;
  }

  const completedDate = new Date(task.completedAt);

  if (Number.isNaN(completedDate.getTime())) {
    return false;
  }

  const today = new Date();

  return completedDate.toDateString() === today.toDateString();
}

export default function DashboardPage() {
  const { tasks } = useTasksStore();

  const activeTasks = tasks.filter((task) => task.status !== "done").length;
  const overdueTasks = tasks.filter(isTaskOverdue).length;
  const completedTodayTasks = tasks.filter(isCompletedToday).length;

  return (
    <main className="min-h-screen bg-background px-8 pt-24 pb-12 text-on-surface">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-h1 text-primary">בוקר טוב, יותם 👋</h2>
          <p className="text-slate-500">
            הנה תמונת המצב שלך להיום מתוך מודול המשימות
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="משימות פעילות"
            value={activeTasks.toString()}
            change="פתוחות לטיפול"
            icon="checklist"
            positive
          />

          <SummaryCard
            title="משימות באיחור"
            value={overdueTasks.toString()}
            change={overdueTasks > 0 ? "דורש טיפול" : "אין איחורים"}
            icon="warning"
            positive={overdueTasks === 0}
          />

          <SummaryCard
            title="הושלמו היום"
            value={completedTodayTasks.toString()}
            change="נסגרו היום"
            icon="task_alt"
            positive
          />
        </div>

        {/* Bento Grid */}
        <div className="mt-8 grid grid-cols-12 items-stretch gap-gutter">
          <ProductivityChart tasks={tasks} />
          <FocusSession tasks={tasks} />
          <NetworkActivity tasks={tasks} />
          <WellnessCard tasks={tasks} />
        </div>
      </div>
    </main>
  );
}