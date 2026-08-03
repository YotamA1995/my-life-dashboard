import type {
  Budget,
  FinanceTransaction,
} from "../store/useFinanceStore";

export type MonthlyFinanceSummary = {
  monthTransactions: FinanceTransaction[];
  completedTransactions: FinanceTransaction[];
  pendingTransactions: FinanceTransaction[];
  income: number;
  expenses: number;
  balance: number;
  pendingAmount: number;
};

export type BudgetProgress = Budget & {
  spent: number;
  remaining: number;
  percentage: number;
  exceeded: boolean;
  nearLimit: boolean;
};

export function getMonthlyFinanceSummary(
  transactions: FinanceTransaction[],
  monthKey: string,
): MonthlyFinanceSummary {
  const monthTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(monthKey),
  );
  const completedTransactions = monthTransactions.filter(
    (transaction) => transaction.status === "completed",
  );
  const pendingTransactions = monthTransactions.filter(
    (transaction) => transaction.status === "pending",
  );
  const income = completedTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = completedTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const pendingAmount = pendingTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  return {
    monthTransactions,
    completedTransactions,
    pendingTransactions,
    income,
    expenses,
    balance: income - expenses,
    pendingAmount,
  };
}

export function getBudgetProgress(
  transactions: FinanceTransaction[],
  budgets: Budget[],
  monthKey: string,
): BudgetProgress[] {
  const { completedTransactions } = getMonthlyFinanceSummary(
    transactions,
    monthKey,
  );

  return budgets
    .map((budget) => {
      const spent = completedTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === budget.category,
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const rawPercentage = (spent / budget.amount) * 100;

      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        percentage: Math.min(100, rawPercentage),
        exceeded: spent > budget.amount,
        nearLimit: spent <= budget.amount && rawPercentage >= 80,
      };
    })
    .sort((first, second) => {
      if (first.exceeded !== second.exceeded) {
        return first.exceeded ? -1 : 1;
      }

      return second.percentage - first.percentage;
    });
}
