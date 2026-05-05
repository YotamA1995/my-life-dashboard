import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-on-surface flex">
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 mr-64 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center px-8 sticky top-0 z-40">
          <h1 className="text-h2 text-primary">סקירת לוח הבקרה</h1>
        </header>

        {/* Content */}
        <main className="p-8 space-y-8">
          {/* Greeting */}
          <div>
            <div className="flex items-end gap-3">
              <h2 className="text-h1 text-primary">בוקר טוב, יותם</h2>
            </div>
            <p className="text-slate-500">הנה מה שקורה אצלך היום</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-label-caps text-slate-400 uppercase">יתרה כוללת</span>
                  <span className="material-symbols-outlined text-blue-600">account_balance_wallet</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-h2 text-primary">₪42,850</span>
                  <span className="text-on-tertiary-fixed-variant text-xs font-bold flex items-center bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                    +2.4%
                    <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 h-12 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                  <path
                    d="M0 35 Q 25 30, 50 35 T 100 15 T 150 25 T 200 5"
                    fill="none"
                    stroke="#2170e4"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0 35 Q 25 30, 50 35 T 100 15 T 150 25 T 200 5 L 200 40 L 0 40 Z"
                    fill="url(#sparkline-grad)"
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#2170e4" stopOpacity="1" />
                      <stop offset="100%" stopColor="#2170e4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-card-padding shadow-sm">
              <p className="text-xs text-slate-400 uppercase">המשמרת הבאה</p>
              <p className="text-h2 text-primary mt-2">09:00 - 17:30</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-card-padding shadow-sm">
              <p className="text-xs text-slate-400 uppercase">משימות דחופות</p>
              <p className="text-h2 text-primary mt-2">3 משימות</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
