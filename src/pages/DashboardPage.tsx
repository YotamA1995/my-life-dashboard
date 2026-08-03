import SummaryCard from "../components/SummaryCard";
import ProductivityChart from "../components/ProductivityChart";
import FocusSession from "../components/FocusSession";
import NetworkActivity from "../components/NetworkActivity";
import WellnessCard from "../components/WellnessCard";
import { useTasksStore } from "../store/useTasksStore";
import type { Task } from "../store/useTasksStore";
import { isCompletedToday, isOverdue } from "../utils/dateUtils";
import { useSettingsStore } from "../store/useSettingsStore";
import { useFinanceStore } from "../store/useFinanceStore";
import FinanceOverviewCard from "../components/FinanceOverviewCard";

function isTaskOverdue(task: Task) {
  return task.status !== "done" && isOverdue(task.dueDate);
}

function wasTaskCompletedToday(task: Task) {
  return task.status === "done" && isCompletedToday(task.completedAt);
}

export default function DashboardPage() {
  const { tasks } = useTasksStore();
  const dashboardWidgets = useSettingsStore(
    (state) => state.dashboardWidgets,
  );
  const { transactions, budgets } = useFinanceStore();

  const activeTasks = tasks.filter((task) => task.status !== "done").length;
  const overdueTasks = tasks.filter(isTaskOverdue).length;
  const completedTodayTasks = tasks.filter(wasTaskCompletedToday).length;

  return (
    <main className="min-h-screen bg-background px-4 pt-20 pb-8 text-on-surface sm:px-6 sm:pb-10 lg:px-8 lg:pt-24 lg:pb-12">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-primary sm:text-h1">בוקר טוב, יותם 👋</h2>
          <p className="text-slate-500">
            הנה תמונת המצב המשולבת שלך להיום
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-gutter xl:grid-cols-3">
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
        {Object.values(dashboardWidgets).some(Boolean) ? (
          <div className="mt-6 grid grid-cols-12 items-stretch gap-4 lg:mt-8 lg:gap-gutter">
            {dashboardWidgets.finance ? (
              <FinanceOverviewCard
                transactions={transactions}
                budgets={budgets}
              />
            ) : null}
            {dashboardWidgets.productivity ? (
              <ProductivityChart tasks={tasks} />
            ) : null}
            {dashboardWidgets.focus ? <FocusSession tasks={tasks} /> : null}
            {dashboardWidgets.activity ? (
              <NetworkActivity tasks={tasks} />
            ) : null}
            {dashboardWidgets.status ? <WellnessCard tasks={tasks} /> : null}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-outline-variant bg-surface-container-low p-8 text-center lg:mt-8">
            <span className="material-symbols-outlined text-4xl text-outline">
              dashboard_customize
            </span>
            <p className="mt-3 font-semibold text-primary">
              כל רכיבי לוח הבקרה מוסתרים
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              אפשר להחזיר רכיבים דרך מסך ההגדרות.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
