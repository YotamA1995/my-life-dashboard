import { Link } from "react-router-dom";
import type {
  Budget,
  FinanceTransaction,
} from "../store/useFinanceStore";
import { getTodayDate } from "../utils/dateUtils";
import {
  getBudgetProgress,
  getMonthlyFinanceSummary,
} from "../utils/financeAnalytics";

type FinanceOverviewCardProps = {
  transactions: FinanceTransaction[];
  budgets: Budget[];
};

const currencyFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export default function FinanceOverviewCard({
  transactions,
  budgets,
}: FinanceOverviewCardProps) {
  const monthKey = getTodayDate().slice(0, 7);
  const summary = getMonthlyFinanceSummary(transactions, monthKey);
  const budgetAlerts = getBudgetProgress(transactions, budgets, monthKey)
    .filter((budget) => budget.exceeded || budget.nearLimit)
    .slice(0, 3);

  return (
    <section className="col-span-12 overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-xl bg-on-tertiary-container/10 text-on-tertiary-container">
              account_balance_wallet
            </span>
            <div>
              <h3 className="text-h3 text-primary">תמונה פיננסית החודש</h3>
              <p className="text-sm text-on-surface-variant">
                נתונים שהושלמו, עסקאות ממתינות ומצב התקציב
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/finance"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 text-sm font-semibold text-primary transition-colors hover:bg-surface-container"
        >
          מעבר לכספים
          <span className="material-symbols-outlined text-lg rotate-180">
            arrow_forward
          </span>
        </Link>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
        {[
          {
            label: "הכנסות",
            value: summary.income,
            tone: "text-on-tertiary-container",
          },
          { label: "הוצאות", value: summary.expenses, tone: "text-error" },
          {
            label: "מאזן",
            value: summary.balance,
            tone:
              summary.balance >= 0
                ? "text-on-tertiary-container"
                : "text-error",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-surface-container-low p-4"
          >
            <p className="text-sm text-on-surface-variant">{item.label}</p>
            <p className={`mt-2 text-2xl font-bold ${item.tone}`}>
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 border-t border-slate-100 p-5 sm:p-6 lg:grid-cols-2">
        <div className="rounded-xl border border-outline-variant/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-primary">עסקאות ממתינות</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {summary.pendingTransactions.length > 0
                  ? `${summary.pendingTransactions.length} עסקאות בסך ${formatCurrency(summary.pendingAmount)}`
                  : "אין עסקאות ממתינות החודש"}
              </p>
            </div>
            <span
              className={`material-symbols-outlined ${
                summary.pendingTransactions.length > 0
                  ? "text-secondary"
                  : "text-on-tertiary-container"
              }`}
            >
              {summary.pendingTransactions.length > 0
                ? "schedule"
                : "check_circle"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant/60 p-4">
          <p className="font-semibold text-primary">מצב התקציב</p>
          {budgets.length === 0 ? (
            <p className="mt-1 text-sm text-on-surface-variant">
              עדיין לא הוגדרו תקציבים חודשיים
            </p>
          ) : budgetAlerts.length === 0 ? (
            <p className="mt-1 text-sm text-on-tertiary-container">
              כל הקטגוריות נמצאות מתחת ל־80% מהתקציב
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {budgetAlerts.map((budget) => (
                <li
                  key={budget.category}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-on-surface-variant">
                    {budget.category}
                  </span>
                  <span
                    className={
                      budget.exceeded
                        ? "font-semibold text-error"
                        : "font-semibold text-amber-600"
                    }
                  >
                    {budget.exceeded
                      ? `חריגה של ${formatCurrency(Math.abs(budget.remaining))}`
                      : `${Math.round(budget.percentage)}% נוצלו`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
