import { describe, expect, it } from "vitest";
import type { AppBackupData } from "./appBackup";
import {
  createAppBackup,
  getAppBackupSummary,
  validateAppBackup,
} from "./appBackup";

const timestamp = "2026-08-03T08:00:00.000Z";

const validData: AppBackupData = {
  tasks: [
    {
      id: "task-1",
      title: "משימה",
      description: "",
      dueDate: "2026-08-04",
      status: "todo",
      priority: "medium",
      category: "personal",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ],
  finance: {
    transactions: [
      {
        id: "transaction-1",
        title: "עסקה",
        category: "אחר",
        amount: 100,
        type: "expense",
        status: "completed",
        date: "2026-08-03",
        note: "",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    budgets: [{ category: "אחר", amount: 500 }],
  },
  settings: {
    theme: "dark",
    dashboardWidgets: {
      finance: true,
      productivity: true,
      focus: false,
      activity: true,
      status: true,
    },
    savedAt: timestamp,
  },
};

describe("app backup", () => {
  it("creates, validates and summarizes a complete backup", () => {
    const backup = createAppBackup(validData, timestamp);
    const validated = validateAppBackup(backup);

    expect(validated).toBeDefined();
    expect(getAppBackupSummary(validated!)).toEqual({
      taskCount: 1,
      transactionCount: 1,
      budgetCount: 1,
    });
  });

  it("rejects a partial backup", () => {
    const partialBackup = {
      version: 1,
      exportedAt: timestamp,
      data: { tasks: validData.tasks },
    };

    expect(validateAppBackup(partialBackup)).toBeUndefined();
  });

  it("rejects an unsupported backup version", () => {
    const backup = createAppBackup(validData, timestamp);

    expect(validateAppBackup({ ...backup, version: 99 })).toBeUndefined();
  });

  it("rejects a backup when one module is malformed", () => {
    const malformedBackup = createAppBackup(validData, timestamp);
    const malformedValue = {
      ...malformedBackup,
      data: {
        ...malformedBackup.data,
        finance: {
          transactions: [{ id: "invalid" }],
          budgets: [],
        },
      },
    };

    expect(validateAppBackup(malformedValue)).toBeUndefined();
  });
});
