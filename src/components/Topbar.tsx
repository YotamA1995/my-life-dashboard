

import { useLocation } from "react-router-dom";

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
      <div className="flex items-center gap-2 sm:gap-4 xl:gap-6">
        {/* Tabs */}
        <nav className="hidden items-center gap-6 xl:flex">
          <a className="text-sm font-semibold text-slate-900 border-b-2 border-blue-600 pb-1" href="#">
            הנחיות
          </a>
          <a className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-all" href="#">
            אנליטיקה
          </a>
          <a className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-all" href="#">
            ארכיון
          </a>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" aria-label="התראות" className="relative p-2 text-slate-500 hover:text-blue-600">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 left-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>

          <button type="button" aria-label="מצב כהה" className="hidden p-2 text-slate-500 hover:text-blue-600 sm:block">
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-200 md:block"></div>

        {/* Profile + Action */}
        <div className="hidden items-center gap-3 md:flex">
          <img
            src="https://i.pravatar.cc/100"
            alt="user"
            className="w-8 h-8 rounded-full border border-slate-200"
          />

          <button className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
            הוספת מודול
          </button>
        </div>
      </div>
    </header>
  );
}
