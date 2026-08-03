import { describe, expect, it } from "vitest";
import type { FinanceTransaction } from "../store/useFinanceStore";
import {
  getBudgetProgress,
  getMonthlyFinanceSummary,
} from "./financeAnalytics";

const timestamp = "2026-08-03T08:00:00.000Z";

function transaction(
  overrides: Partial<FinanceTransaction> & Pick<FinanceTransaction, "id">,
): FinanceTransaction {
  return {
    title: "עסקה",
    category: "מזון",
    amount: 100,
    type: "expense",
    status: "completed",
    date: "2026-08-03",
    note: "",
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

describe("finance analytics", () => {
  it("calculates a monthly summary from completed and pending transactions", () => {
    const summary = getMonthlyFinanceSummary(
      [
        transaction({ id: "income", type: "income", amount: 1000 }),
        transaction({ id: "expense", amount: 300 }),
        transaction({ id: "pending", amount: 200, status: "pending" }),
        transaction({ id: "other-month", amount: 900, date: "2026-07-31" }),
      ],
      "2026-08",
    );

    expect(summary.income).toBe(1000);
    expect(summary.expenses).toBe(300);
    expect(summary.balance).toBe(700);
    expect(summary.pendingAmount).toBe(200);
    expect(summary.pendingTransactions).toHaveLength(1);
  });

  it("identifies budgets that are near or over their limit", () => {
    const progress = getBudgetProgress(
      [
        transaction({ id: "food", amount: 850, category: "מזון" }),
        transaction({ id: "home", amount: 1200, category: "דיור" }),
      ],
      [
        { category: "מזון", amount: 1000 },
        { category: "דיור", amount: 1000 },
      ],
      "2026-08",
    );

    expect(progress[0]).toMatchObject({
      category: "דיור",
      exceeded: true,
      nearLimit: false,
      remaining: -200,
    });
    expect(progress[1]).toMatchObject({
      category: "מזון",
      exceeded: false,
      nearLimit: true,
      percentage: 85,
    });
  });
});
