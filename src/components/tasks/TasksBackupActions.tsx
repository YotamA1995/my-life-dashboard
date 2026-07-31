import { useRef } from "react";
import type { ChangeEvent } from "react";
import type { Task } from "../../store/useTasksStore";

type TasksBackupActionsProps = {
  tasks: Task[];
  onImport: (tasks: unknown) => number | undefined;
  onMessage: (message: string, tone: "success" | "error") => void;
};

export default function TasksBackupActions({
  tasks,
  onImport,
  onMessage,
}: TasksBackupActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `lifehub-tasks-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onMessage("גיבוי המשימות הורד בהצלחה", "success");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const parsedBackup = JSON.parse(await file.text()) as unknown;
      const tasksToImport =
        parsedBackup &&
        typeof parsedBackup === "object" &&
        "tasks" in parsedBackup
          ? (parsedBackup as { tasks: unknown }).tasks
          : parsedBackup;

      if (
        !window.confirm(
          "ייבוא הגיבוי יחליף את רשימת המשימות הנוכחית. להמשיך?",
        )
      ) {
        return;
      }

      const importedCount = onImport(tasksToImport);

      if (importedCount === undefined) {
        onMessage("קובץ הגיבוי אינו תקין ולא בוצע שינוי", "error");
        return;
      }

      onMessage(`יובאו ${importedCount} משימות מהגיבוי`, "success");
    } catch {
      onMessage("לא ניתן לקרוא את קובץ הגיבוי", "error");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleExport}
        className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        ייצוא גיבוי
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container"
      >
        <span className="material-symbols-outlined text-[18px]">upload</span>
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
