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

export type FinanceBackupData = {
  transactions: FinanceTransaction[];
  budgets: Budget[];
};

type FinanceStore = {
  transactions: FinanceTransaction[];
  budgets: Budget[];
  addTransaction: (input: TransactionInput) => string | undefined;
  updateTransaction: (
    transactionId: string,
    input: TransactionInput,
  ) => void;
  deleteTransaction: (transactionId: string) => FinanceTransaction | undefined;
  restoreTransaction: (transaction: FinanceTransaction) => void;
  setBudget: (category: string, amount: number) => void;
  deleteBudget: (category: string) => void;
  replaceFinanceData: (data: unknown) =>
    | { transactionCount: number; budgetCount: number }
    | undefined;
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

function normalizeTimestamp(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  return Number.isNaN(new Date(value).getTime()) ? fallback : value;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isValidDateKey(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day, 12));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
}

function isStoredTransaction(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.category === "string" &&
    value.category.trim().length > 0 &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    value.amount > 0 &&
    (value.type === "income" || value.type === "expense") &&
    (value.status === "completed" || value.status === "pending") &&
    isValidDateKey(value.date) &&
    (value.note === undefined || typeof value.note === "string") &&
    (value.createdAt === undefined || typeof value.createdAt === "string") &&
    (value.updatedAt === undefined || typeof value.updatedAt === "string")
  );
}

function normalizeStoredTransaction(value: Record<string, unknown>) {
  const input = normalizeInput({
    title: value.title as string,
    category: value.category as string,
    amount: value.amount as number,
    type: value.type as TransactionType,
    status: value.status as TransactionStatus,
    date: value.date as string,
    note: typeof value.note === "string" ? value.note : "",
  });

  if (!input) {
    return undefined;
  }

  const fallbackTimestamp = new Date().toISOString();
  const createdAt = normalizeTimestamp(value.createdAt, fallbackTimestamp);

  return {
    ...input,
    id: (value.id as string).trim(),
    createdAt,
    updatedAt: normalizeTimestamp(value.updatedAt, createdAt),
  } satisfies FinanceTransaction;
}

function isStoredBudget(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.category === "string" &&
    value.category.trim().length > 0 &&
    typeof value.amount === "number" &&
    Number.isFinite(value.amount) &&
    value.amount > 0
  );
}

export function normalizeFinanceData(data: unknown): FinanceBackupData | undefined {
  if (
    !isRecord(data) ||
    !Array.isArray(data.transactions) ||
    !Array.isArray(data.budgets) ||
    !data.transactions.every(isStoredTransaction) ||
    !data.budgets.every(isStoredBudget)
  ) {
    return undefined;
  }

  const transactions = Array.from(
    new Map(
      data.transactions.map((value) => {
        const transaction = normalizeStoredTransaction(value);

        return [transaction!.id, transaction!];
      }),
    ).values(),
  );
  const budgets = Array.from(
    new Map(
      data.budgets.map((value) => {
        const category = value.category.trim();

        return [
          category,
          { category, amount: normalizeAmount(value.amount) } satisfies Budget,
        ];
      }),
    ).values(),
  );

  return { transactions, budgets };
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

      restoreTransaction(transaction) {
        const normalizedData = normalizeFinanceData({
          transactions: [transaction],
          budgets: [],
        });
        const restoredTransaction = normalizedData?.transactions[0];

        if (!restoredTransaction) {
          return;
        }

        set((state) => ({
          transactions: state.transactions.some(
            (item) => item.id === restoredTransaction.id,
          )
            ? state.transactions
            : [...state.transactions, restoredTransaction],
        }));
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

      replaceFinanceData(data) {
        const normalizedData = normalizeFinanceData(data);

        if (!normalizedData) {
          return undefined;
        }

        set(normalizedData);

        return {
          transactionCount: normalizedData.transactions.length,
          budgetCount: normalizedData.budgets.length,
        };
      },
    }),
    {
      name: "finance-storage",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
      }),
      migrate: (persistedState) =>
        normalizeFinanceData(persistedState) ?? {
          transactions: [],
          budgets: [],
        },
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(normalizeFinanceData(persistedState) ?? {
          transactions: [],
          budgets: [],
        }),
      }),
    },
  ),
);
