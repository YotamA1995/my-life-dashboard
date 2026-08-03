

import { useLocation } from "react-router-dom";
import { useSettingsStore } from "../store/useSettingsStore";

const routeTitles: Record<string, string> = {
  "/": "סקירת לוח הבקרה",
  "/finance": "כספים",
  "/schedule": "לוח זמנים",
  "/tasks": "ניהול משימות",
  "/settings": "הגדרות",
};

type TopbarProps = {
  onMenuOpen: () => void;
};

export default function Topbar({ onMenuOpen }: TopbarProps) {
  const location = useLocation();
  const title = routeTitles[location.pathname] ?? "LifeHub";
  const { theme, setTheme } = useSettingsStore();

  function toggleTheme() {
    const resolvedTheme = document.documentElement.dataset.theme;

    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:right-64 lg:px-8">
      {/* Title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="פתח תפריט"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="truncate text-lg font-semibold text-primary sm:text-h2">
          {title}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
          title={theme === "system" ? "ערכת הנושא נקבעת לפי המערכת" : undefined}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
        >
          <span className="material-symbols-outlined">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </div>
    </header>
  );
}
