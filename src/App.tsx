function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-on-surface flex">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed right-0 top-0 border-l border-slate-200 bg-slate-50 flex flex-col py-4">
        <div className="text-xl font-bold text-slate-900 px-6 py-8">
          <span className="text-blue-600">Life</span>Hub
        </div>

        <nav className="flex-1 px-4 space-y-1 text-sm">
          <div className="px-4 py-3 text-blue-600 border-l-2 border-blue-600 bg-blue-50 rounded-md">סקירה כללית</div>
          <div className="px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer">כספים</div>
          <div className="px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer">לוח זמנים</div>
          <div className="px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer">משימות</div>
          <div className="px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer">הגדרות</div>
        </nav>

        <div className="px-6">
          <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-semibold text-sm">
            ערך חדש
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 mr-64 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8">
          <h1 className="text-h2 text-primary">סקירת לוח הבקרה</h1>
        </header>

        {/* Content */}
        <main className="p-8 space-y-8">
          {/* Greeting */}
          <div>
            <h2 className="text-h1 text-primary">בוקר טוב, יותם</h2>
            <p className="text-slate-500">הנה מה שקורה אצלך היום</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-white border border-slate-200 rounded-xl p-card-padding">
              <p className="text-sm text-slate-400">יתרה כוללת</p>
              <p className="text-h2 text-primary mt-2">₪42,850</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-card-padding">
              <p className="text-sm text-slate-400">המשמרת הבאה</p>
              <p className="text-h2 text-primary mt-2">09:00 - 17:30</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-card-padding">
              <p className="text-sm text-slate-400">משימות דחופות</p>
              <p className="text-h2 text-primary mt-2">3 משימות</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
