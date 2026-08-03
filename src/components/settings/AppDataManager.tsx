import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useTasksStore } from "../../store/useTasksStore";
import {
  createAppBackup,
  getAppBackupSummary,
  validateAppBackup,
  type AppBackup,
  type AppBackupData,
} from "../../utils/appBackup";
import Modal from "../ui/Modal";

function downloadBackup(backup: AppBackup, fileName: string) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function getFileTimestamp() {
  return new Date().toISOString().replaceAll(":", "-").slice(0, 19);
}

export default function AppDataManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tasks, replaceTasks } = useTasksStore();
  const {
    transactions,
    budgets,
    replaceFinanceData,
  } = useFinanceStore();
  const {
    theme,
    dashboardWidgets,
    savedAt,
    replaceSettings,
  } = useSettingsStore();
  const [pendingBackup, setPendingBackup] = useState<AppBackup | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    tone: "success" | "error";
  } | null>(null);

  function getCurrentData(): AppBackupData {
    return {
      tasks,
      finance: { transactions, budgets },
      settings: { theme, dashboardWidgets, savedAt },
    };
  }

  function handleExport() {
    downloadBackup(
      createAppBackup(getCurrentData()),
      `lifehub-full-backup-${getFileTimestamp()}.json`,
    );
    setMessage({ text: "הגיבוי המלא הורד בהצלחה", tone: "success" });
  }

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const parsedBackup = JSON.parse(await file.text()) as unknown;
      const validatedBackup = validateAppBackup(parsedBackup);

      if (!validatedBackup) {
        setMessage({
          text: "הקובץ אינו גיבוי מלא ותקין של LifeHub. לא בוצע שינוי.",
          tone: "error",
        });
        return;
      }

      setMessage(null);
      setPendingBackup(validatedBackup);
    } catch {
      setMessage({
        text: "לא ניתן לקרוא את קובץ הגיבוי. לא בוצע שינוי.",
        tone: "error",
      });
    } finally {
      event.target.value = "";
    }
  }

  function handleRestore() {
    if (!pendingBackup) {
      return;
    }

    const currentData = getCurrentData();
    const rescueBackup = createAppBackup(currentData);

    downloadBackup(
      rescueBackup,
      `lifehub-rescue-before-restore-${getFileTimestamp()}.json`,
    );

    const taskResult = replaceTasks(pendingBackup.data.tasks);
    const financeResult = replaceFinanceData(pendingBackup.data.finance);
    const settingsResult = replaceSettings(pendingBackup.data.settings);

    if (
      taskResult === undefined ||
      financeResult === undefined ||
      !settingsResult
    ) {
      replaceTasks(currentData.tasks);
      replaceFinanceData(currentData.finance);
      replaceSettings(currentData.settings);
      setMessage({
        text: "השחזור לא הושלם והמצב הקודם הוחזר.",
        tone: "error",
      });
      setPendingBackup(null);
      return;
    }

    setPendingBackup(null);
    setMessage({
      text: "כל נתוני המערכת שוחזרו. גיבוי הצלה של המצב הקודם הורד למכשיר.",
      tone: "success",
    });
  }

  const pendingSummary = pendingBackup
    ? getAppBackupSummary(pendingBackup)
    : null;

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="border-b border-slate-100 bg-surface-container-low p-5 sm:p-6">
          <h3 className="text-h3 text-primary">ניהול נתונים</h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            גיבוי אחד כולל את המשימות, הכספים והגדרות המערכת.
          </p>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined mt-0.5 text-secondary">
              shield
            </span>
            <div>
              <p className="font-semibold text-primary">גיבוי מלא של LifeHub</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-on-surface-variant">
                לפני שחזור נבדק כל הקובץ, מוצגת תצוגה מקדימה ומורד אוטומטית
                גיבוי הצלה של המצב הנוכחי.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 text-sm font-semibold text-primary transition-colors hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              ייצוא גיבוי מלא
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <span className="material-symbols-outlined text-lg">upload</span>
              שחזור מגיבוי
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileSelection}
              className="hidden"
            />
          </div>
        </div>

        {message ? (
          <div
            role="status"
            className={`border-t px-5 py-4 text-sm sm:px-6 ${
              message.tone === "error"
                ? "border-error/20 bg-error-container text-on-error-container"
                : "border-on-tertiary-container/20 bg-on-tertiary-container/10 text-on-tertiary-container"
            }`}
          >
            {message.text}
          </div>
        ) : null}
      </section>

      <Modal
        open={Boolean(pendingBackup)}
        title="אישור שחזור מלא"
        description="הקובץ נמצא תקין. בדוק את התכולה לפני החלפת הנתונים הנוכחיים."
        onClose={() => setPendingBackup(null)}
      >
        {pendingBackup && pendingSummary ? (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "משימות", value: pendingSummary.taskCount },
                { label: "עסקאות", value: pendingSummary.transactionCount },
                { label: "תקציבים", value: pendingSummary.budgetCount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-surface-container-low p-3 text-center"
                >
                  <p className="text-xl font-bold text-primary">{item.value}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-outline-variant p-4 text-sm text-on-surface-variant">
              הגיבוי נוצר בתאריך {new Intl.DateTimeFormat("he-IL", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(pendingBackup.exportedAt))}.
            </div>

            <p className="rounded-xl bg-error-container px-4 py-3 text-sm leading-6 text-on-error-container">
              השחזור יחליף את כל הנתונים הנוכחיים. לפני ההחלפה יורד למכשיר
              גיבוי הצלה אוטומטי.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingBackup(null)}
                className="h-11 rounded-xl px-5 font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={handleRestore}
                className="h-11 rounded-xl bg-error px-5 font-semibold text-on-error hover:opacity-90"
              >
                החלפת כל הנתונים
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
