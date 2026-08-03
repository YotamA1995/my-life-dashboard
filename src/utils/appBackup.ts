import type { FinanceBackupData } from "../store/useFinanceStore";
import { normalizeFinanceData } from "../store/useFinanceStore";
import type { AppSettings } from "../store/useSettingsStore";
import { normalizeSettingsBackup } from "../store/useSettingsStore";
import type { Task } from "../store/useTasksStore";
import { normalizeTasksData } from "../store/useTasksStore";

export const APP_BACKUP_VERSION = 1;

export type AppBackupData = {
  tasks: Task[];
  finance: FinanceBackupData;
  settings: AppSettings;
};

export type AppBackup = {
  version: number;
  exportedAt: string;
  data: AppBackupData;
};

export type AppBackupSummary = {
  taskCount: number;
  transactionCount: number;
  budgetCount: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export function createAppBackup(
  data: AppBackupData,
  exportedAt = new Date().toISOString(),
): AppBackup {
  return {
    version: APP_BACKUP_VERSION,
    exportedAt,
    data,
  };
}

export function validateAppBackup(value: unknown): AppBackup | undefined {
  if (
    !isRecord(value) ||
    value.version !== APP_BACKUP_VERSION ||
    typeof value.exportedAt !== "string" ||
    Number.isNaN(new Date(value.exportedAt).getTime()) ||
    !isRecord(value.data)
  ) {
    return undefined;
  }

  const tasks = normalizeTasksData(value.data.tasks);
  const finance = normalizeFinanceData(value.data.finance);
  const settings = normalizeSettingsBackup(value.data.settings);

  if (!tasks || !finance || !settings) {
    return undefined;
  }

  return {
    version: APP_BACKUP_VERSION,
    exportedAt: value.exportedAt,
    data: { tasks, finance, settings },
  };
}

export function getAppBackupSummary(backup: AppBackup): AppBackupSummary {
  return {
    taskCount: backup.data.tasks.length,
    transactionCount: backup.data.finance.transactions.length,
    budgetCount: backup.data.finance.budgets.length,
  };
}
