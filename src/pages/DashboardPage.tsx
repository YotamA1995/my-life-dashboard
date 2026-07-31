import SummaryCard from "../components/SummaryCard";
import ProductivityChart from "../components/ProductivityChart";
import FocusSession from "../components/FocusSession";
import NetworkActivity from "../components/NetworkActivity";
import WellnessCard from "../components/WellnessCard";
import { useTasksStore } from "../store/useTasksStore";
import type { Task } from "../store/useTasksStore";
import { isCompletedToday, isOverdue } from "../utils/dateUtils";

function isTaskOverdue(task: Task) {
  return task.status !== "done" && isOverdue(task.dueDate);
}

function wasTaskCompletedToday(task: Task) {
  return task.status === "done" && isCompletedToday(task.completedAt);
}

export default function DashboardPage() {
  const { tasks } = useTasksStore();

  const activeTasks = tasks.filter((task) => task.status !== "done").length;
  const overdueTasks = tasks.filter(isTaskOverdue).length;
  const completedTodayTasks = tasks.filter(wasTaskCompletedToday).length;

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
