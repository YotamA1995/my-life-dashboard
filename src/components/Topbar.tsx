

import React from "react";

const Topbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-[calc(100%-16rem)] h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md z-40 flex justify-between items-center px-8">
      {/* Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-h2 text-primary">סקירת לוח הבקרה</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Tabs */}
        <nav className="hidden lg:flex items-center gap-6">
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
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:text-blue-600 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 left-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>

          <button className="p-2 text-slate-500 hover:text-blue-600">
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-200"></div>

        {/* Profile + Action */}
        <div className="flex items-center gap-3">
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
};

export default Topbar;