import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { normalizeDateKey } from "../utils/dateUtils";

export type TransactionType = "income" | "expense";
export type TransactionStatus = "completed" | "pending";

export type FinanceTransaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type Budget = {
  category: string;
  amount: number;
};

export type TransactionInput = Omit<
  FinanceTransaction,
  "id" | "createdAt" | "updatedAt"
>;

type FinanceStore = {
  transactions: FinanceTransaction[];
  budgets: Budget[];
  addTransaction: (input: TransactionInput) => string | undefined;
  updateTransaction: (
    transactionId: string,
    input: TransactionInput,
  ) => void;
  deleteTransaction: (transactionId: string) => FinanceTransaction | undefined;
  setBudget: (category: string, amount: number) => void;
  deleteBudget: (category: string) => void;
};

function createTransactionId() {
  return `transaction-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeText(value: string) {
  return value.trim();
}

function normalizeAmount(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.round(value * 100) / 100) : 0;
}

function normalizeInput(input: TransactionInput): TransactionInput | undefined {
  const title = normalizeText(input.title);
  const category = normalizeText(input.category);
  const amount = normalizeAmount(input.amount);

  if (!title || !category || amount <= 0) {
    return undefined;
  }

  return {
    title,
    category,
    amount,
    type: input.type === "income" ? "income" : "expense",
    status: input.status === "pending" ? "pending" : "completed",
    date: normalizeDateKey(input.date),
    note: normalizeText(input.note),
  };
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: [],

      addTransaction(input) {
        const normalizedInput = normalizeInput(input);

        if (!normalizedInput) {
          return undefined;
        }

        const timestamp = new Date().toISOString();
        const transaction: FinanceTransaction = {
          ...normalizedInput,
          id: createTransactionId(),
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          transactions: [...state.transactions, transaction],
        }));

        return transaction.id;
      },

      updateTransaction(transactionId, input) {
        const normalizedInput = normalizeInput(input);

        if (!normalizedInput) {
          return;
        }

        const timestamp = new Date().toISOString();

        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, ...normalizedInput, updatedAt: timestamp }
              : transaction,
          ),
        }));
      },

      deleteTransaction(transactionId) {
        const transaction = get().transactions.find(
          (item) => item.id === transactionId,
        );

        if (!transaction) {
          return undefined;
        }

        set((state) => ({
          transactions: state.transactions.filter(
            (item) => item.id !== transactionId,
          ),
        }));

        return transaction;
      },

      setBudget(category, amount) {
        const normalizedCategory = normalizeText(category);
        const normalizedBudget = normalizeAmount(amount);

        if (!normalizedCategory || normalizedBudget <= 0) {
          return;
        }

        set((state) => ({
          budgets: state.budgets.some(
            (budget) => budget.category === normalizedCategory,
          )
            ? state.budgets.map((budget) =>
                budget.category === normalizedCategory
                  ? { ...budget, amount: normalizedBudget }
                  : budget,
              )
            : [...state.budgets, { category: normalizedCategory, amount: normalizedBudget }],
        }));
      },

      deleteBudget(category) {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.category !== category),
        }));
      },
    }),
    {
      name: "finance-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
      }),
    },
  ),
);
