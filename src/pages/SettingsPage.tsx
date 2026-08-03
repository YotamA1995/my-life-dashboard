import { useEffect, useMemo, useState } from "react";
import {
  useSettingsStore,
  type DashboardWidgetKey,
  type DashboardWidgets,
  type ThemePreference,
} from "../store/useSettingsStore";

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: "light",
    label: "בהיר",
    description: "מראה בהיר וקבוע",
    icon: "light_mode",
  },
  {
    value: "dark",
    label: "כהה",
    description: "מראה כהה וקבוע",
    icon: "dark_mode",
  },
  {
    value: "system",
    label: "לפי המערכת",
    description: "מתחלף לפי הגדרת המכשיר",
    icon: "desktop_windows",
  },
];

const dashboardModules: Array<{
  key: DashboardWidgetKey;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    key: "finance",
    label: "תמונה פיננסית",
    description: "הכנסות, הוצאות, מאזן והתראות תקציב",
    icon: "account_balance_wallet",
  },
  {
    key: "productivity",
    label: "קצב פרודוקטיביות",
    description: "השלמת משימות בשבעת הימים האחרונים",
    icon: "monitoring",
  },
  {
    key: "focus",
    label: "סשן ריכוז",
    description: "המלצה למשימה הבאה וזמן מיקוד",
    icon: "psychology",
  },
  {
    key: "activity",
    label: "פעילות משימות",
    description: "השינויים האחרונים שבוצעו במשימות",
    icon: "history",
  },
  {
    key: "status",
    label: "מצב היום",
    description: "עומס, איחורים ומשימות בעדיפות גבוהה",
    icon: "view_quilt",
  },
];

function Toggle({
  enabled,
  label,
  onToggle,
}: {
  enabled: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
        enabled ? "bg-secondary" : "bg-slate-200"
      }`}
    >
      <span
        className={`theme-preserve-white absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "right-6" : "right-1"
        }`}
      />
    </button>
  );
}

function formatSavedAt(savedAt?: string) {
  if (!savedAt) {
    return "ההגדרות טרם נשמרו באופן ידני";
  }

  return `נשמר לאחרונה ${new Intl.DateTimeFormat("he-IL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(savedAt))}`;
}

export default function SettingsPage() {
  const { theme, dashboardWidgets, savedAt, saveSettings } = useSettingsStore();
  const [draftTheme, setDraftTheme] = useState(theme);
  const [draftWidgets, setDraftWidgets] = useState<DashboardWidgets>({
    ...dashboardWidgets,
  });

  useEffect(() => {
    return useSettingsStore.subscribe((state, previousState) => {
      if (
        state.theme !== previousState.theme ||
        state.dashboardWidgets !== previousState.dashboardWidgets
      ) {
        setDraftTheme(state.theme);
        setDraftWidgets({ ...state.dashboardWidgets });
      }
    });
  }, []);

  const hasChanges = useMemo(
    () =>
      draftTheme !== theme ||
      Object.keys(draftWidgets).some(
        (key) =>
          draftWidgets[key as DashboardWidgetKey] !==
          dashboardWidgets[key as DashboardWidgetKey],
      ),
    [dashboardWidgets, draftTheme, draftWidgets, theme],
  );

  function toggleWidget(key: DashboardWidgetKey) {
    setDraftWidgets((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function resetDraft() {
    setDraftTheme(theme);
    setDraftWidgets({ ...dashboardWidgets });
  }

  function saveDraft() {
    saveSettings({
      theme: draftTheme,
      dashboardWidgets: draftWidgets,
    });
  }

  return (
    <main className="min-h-screen bg-surface px-4 pb-8 pt-20 text-on-surface sm:px-6 sm:pb-10 lg:px-8 lg:pb-12 lg:pt-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-primary sm:text-h1">
            הגדרות והתאמה אישית
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            בחר את מראה המערכת ואת הרכיבים שיופיעו בלוח הבקרה.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="border-b border-slate-100 bg-surface-container-low p-5 sm:p-6">
              <h3 className="text-h3 text-primary">ערכת נושא</h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                הבחירה תחול על כל מסכי המערכת לאחר השמירה.
              </p>
            </div>

            <div className="grid gap-4 p-5 sm:p-6">
              {themeOptions.map((option) => {
                const isSelected = draftTheme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setDraftTheme(option.value)}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-right transition-colors ${
                      isSelected
                        ? "border-secondary bg-secondary/5 ring-1 ring-secondary"
                        : "border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-secondary text-white"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {option.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-primary">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm text-on-surface-variant">
                        {option.description}
                      </span>
                    </span>
                    {isSelected ? (
                      <span className="material-symbols-outlined text-secondary">
                        check_circle
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="border-b border-slate-100 bg-surface-container-low p-5 sm:p-6">
              <h3 className="text-h3 text-primary">רכיבי לוח הבקרה</h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                כרטיסי הסיכום העליונים נשארים מוצגים תמיד.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {dashboardModules.map((module) => (
                <div
                  key={module.key}
                  className="flex items-start justify-between gap-4 p-5 sm:p-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="material-symbols-outlined flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">
                      {module.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-primary">{module.label}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={draftWidgets[module.key]}
                    label={`${draftWidgets[module.key] ? "הסתרת" : "הצגת"} ${module.label}`}
                    onToggle={() => toggleWidget(module.key)}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined mt-0.5 text-secondary">
              save
            </span>
            <div>
              <p className="font-semibold text-primary">שמירה מקומית</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {formatSavedAt(savedAt)}. ההגדרות נשמרות במכשיר ובדפדפן הזה.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resetDraft}
              disabled={!hasChanges}
              className="h-11 rounded-xl px-5 font-semibold text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
            >
              ביטול שינויים
            </button>
            <button
              type="button"
              onClick={saveDraft}
              disabled={!hasChanges}
              className="h-11 rounded-xl bg-secondary px-6 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              שמירת הגדרות
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
