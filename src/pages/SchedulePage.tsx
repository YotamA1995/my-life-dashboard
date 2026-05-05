

export default function SchedulePage() {
  return (
    <main className="pt-24 px-8 pb-12 min-h-screen bg-surface text-on-surface">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Header */}
        <section className="flex justify-between items-end mb-8">
          <div>
            <div className="text-label-caps text-on-surface-variant mb-2">
              תכנון אופרטיבי
            </div>
            <h2 className="text-h1 text-on-surface">בונה לוח זמנים</h2>
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm hover:bg-surface-container">
              <span className="material-symbols-outlined">auto_awesome</span>
              מילוי אוטומטי
            </button>

            <button className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90">
              <span className="material-symbols-outlined">publish</span>
              פרסום
            </button>
          </div>
        </section>

        {/* Layout */}
        <section className="flex gap-6">
          {/* Calendar */}
          <div className="flex-1 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex justify-between items-center p-4 border-b border-outline-variant">
              <div className="flex items-center gap-4">
                <h3 className="text-h3">אוקטובר 2024</h3>
                <div className="flex border rounded-lg overflow-hidden">
                  <button className="p-2 border-l">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                  <button className="p-2">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                </div>
              </div>

              <div className="flex bg-surface-container p-1 rounded-lg">
                <button className="px-4 py-1.5 bg-white rounded-md text-sm font-medium">
                  חודש
                </button>
                <button className="px-4 py-1.5 text-sm text-on-surface-variant">
                  שבוע
                </button>
                <button className="px-4 py-1.5 text-sm text-on-surface-variant">
                  יום
                </button>
              </div>
            </div>

            {/* Calendar Grid (simplified) */}
            <div className="grid grid-cols-7 gap-px bg-outline-variant">
              {["שני","שלישי","רביעי","חמישי","שישי","שבת","ראשון"].map((d) => (
                <div key={d} className="bg-surface-container-low p-3 text-center text-xs">
                  {d}
                </div>
              ))}

              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-2 min-h-[120px] hover:bg-slate-50"
                >
                  <span className="text-xs font-semibold">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <aside className="w-80 flex flex-col gap-6">
            {/* Draft shifts */}
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <h4 className="text-sm font-semibold">טיוטת משמרות</h4>
                <span className="text-xs text-secondary">4 בהמתנה</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 border rounded-lg text-sm">
                  משמרת בוקר
                </div>
                <div className="p-3 border rounded-lg text-sm">
                  משמרת לילה
                </div>

                <button className="w-full py-2 border-dashed border rounded-lg text-sm">
                  + יצירת תבנית
                </button>
              </div>
            </div>

            {/* Staff */}
            <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
              <h4 className="text-sm font-semibold mb-4">צוות זמין</h4>

              <div className="space-y-3">
                <div className="text-sm">שרה חן</div>
                <div className="text-sm">ג'יימס מילר</div>
                <div className="text-sm">אלנה לופז</div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}