import { useRef } from "react";
import type { ChangeEvent } from "react";
import type {
  Budget,
  FinanceTransaction,
} from "../../store/useFinanceStore";

type ImportResult = {
  transactionCount: number;
  budgetCount: number;
};

type FinanceBackupActionsProps = {
  transactions: FinanceTransaction[];
  budgets: Budget[];
  onImport: (data: unknown) => ImportResult | undefined;
  onMessage: (message: string, tone: "success" | "error") => void;
};

export default function FinanceBackupActions({
  transactions,
  budgets,
  onImport,
  onMessage,
}: FinanceBackupActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: { transactions, budgets },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `lifehub-finance-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onMessage("גיבוי הנתונים הפיננסיים הורד בהצלחה", "success");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const parsedBackup = JSON.parse(await file.text()) as unknown;
      const dataToImport =
        parsedBackup &&
        typeof parsedBackup === "object" &&
        "data" in parsedBackup
          ? (parsedBackup as { data: unknown }).data
          : parsedBackup;

      if (
        !window.confirm(
          "ייבוא הגיבוי יחליף את כל העסקאות והתקציבים הנוכחיים. להמשיך?",
        )
      ) {
        return;
      }

      const result = onImport(dataToImport);

      if (!result) {
        onMessage("קובץ הגיבוי אינו תקין ולא בוצע שינוי", "error");
        return;
      }

      onMessage(
        `יובאו ${result.transactionCount} עסקאות ו־${result.budgetCount} תקציבים`,
        "success",
      );
    } catch {
      onMessage("לא ניתן לקרוא את קובץ הגיבוי", "error");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <button
        type="button"
        onClick={handleExport}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant bg-white px-4 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container sm:w-auto"
      >
        <span className="material-symbols-outlined text-lg">download</span>
        ייצוא גיבוי
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant bg-white px-4 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container sm:w-auto"
      >
        <span className="material-symbols-outlined text-lg">upload</span>
        ייבוא גיבוי
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
