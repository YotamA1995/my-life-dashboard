

import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="h-screen w-64 fixed right-0 top-0 border-l border-slate-200 bg-white/80 backdrop-blur-md flex flex-col py-4 z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-slate-900 px-6 py-8">
        <span className="text-blue-600">Life</span>Hub
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">
          חבילה מקצועית
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <a className="flex items-center px-4 py-3 text-blue-600 border-l-2 border-blue-600 bg-blue-50/50 transition-colors text-sm font-medium" href="#">
          <span className="material-symbols-outlined ml-3">dashboard</span>
          סקירה כללית
        </a>

        <a className="flex items-center px-4 py-3 text-slate-500 hover:bg-slate-100 transition-colors text-sm font-medium" href="#">
          <span className="material-symbols-outlined ml-3">payments</span>
          כספים
        </a>

        <a className="flex items-center px-4 py-3 text-slate-500 hover:bg-slate-100 transition-colors text-sm font-medium" href="#">
          <span className="material-symbols-outlined ml-3">calendar_month</span>
          לוח זמנים
        </a>

        <a className="flex items-center px-4 py-3 text-slate-500 hover:bg-slate-100 transition-colors text-sm font-medium" href="#">
          <span className="material-symbols-outlined ml-3">assignment_turned_in</span>
          משימות
        </a>

        <a className="flex items-center px-4 py-3 text-slate-500 hover:bg-slate-100 transition-colors text-sm font-medium" href="#">
          <span className="material-symbols-outlined ml-3">settings</span>
          הגדרות
        </a>
      </nav>

      {/* Bottom actions */}
      <div className="px-6 py-6">
        <button className="w-full bg-primary text-on-primary py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          ערך חדש
        </button>
      </div>

      <div className="px-4 py-4 mt-auto border-t border-slate-200">
        <a className="flex items-center px-4 py-2 text-slate-500 hover:bg-slate-100 transition-colors text-sm font-medium" href="#">
          <span className="material-symbols-outlined ml-3 text-lg">help</span>
          תמיכה
        </a>

        <a className="flex items-center px-4 py-2 text-slate-500 hover:bg-slate-100 transition-colors text-sm font-medium" href="#">
          <span className="material-symbols-outlined ml-3 text-lg">logout</span>
          התנתקות
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;