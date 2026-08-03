import { NavLink } from "react-router-dom";

const navItems = [
  { label: "סקירה כללית", icon: "dashboard", to: "/", end: true },
  { label: "כספים", icon: "payments", to: "/finance" },
  { label: "לוח זמנים", icon: "calendar_month", to: "/schedule" },
  { label: "משימות", icon: "assignment_turned_in", to: "/tasks" },
  { label: "הגדרות", icon: "settings", to: "/settings" },
];

const getNavClassName = ({ isActive }: { isActive: boolean }) =>
  `flex items-center px-4 py-3 transition-colors text-sm font-medium rounded-md ${
    isActive
      ? "text-blue-600 border-l-2 border-blue-600 bg-blue-50/50"
      : "text-slate-500 hover:bg-slate-100"
  }`;

type SidebarProps = {
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

export default function Sidebar({
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="סגור תפריט"
          onClick={onMobileClose}
          className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[60] flex h-dvh w-72 flex-col border-l border-slate-200 bg-white py-4 shadow-2xl transition-transform duration-200 lg:w-64 lg:translate-x-0 lg:bg-white/90 lg:shadow-none lg:backdrop-blur-md ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
      {/* Logo */}
      <div className="flex items-start justify-between px-6 py-6 lg:py-8">
        <div className="text-xl font-bold text-slate-900">
          <span className="text-blue-600">Life</span>Hub
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            חבילה מקצועית
          </p>
        </div>

        <button
          type="button"
          onClick={onMobileClose}
          aria-label="סגור תפריט"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={getNavClassName}
            onClick={onMobileClose}
          >
            <span className="material-symbols-outlined ml-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="material-symbols-outlined text-lg">lock</span>
          <span>הנתונים נשמרים במכשיר זה</span>
        </div>
      </div>
      </aside>
    </>
  );
}
