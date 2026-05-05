const bars = [60, 85, 45, 95, 70, 55, 80];
const days = ["שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון"];

export default function ProductivityChart() {
  return (
    <section className="col-span-12 lg:col-span-8 rounded-xl border border-slate-200 bg-white/90 p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-h3 text-primary">קצב פרודוקטיביות</h3>
          <p className="mt-1 text-sm text-slate-500">מדדי תפוקה לפי ימים</p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-md bg-surface-container px-3 py-1 text-xs font-semibold text-slate-600">
            שבועי
          </button>
          <button className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            חודשי
          </button>
        </div>
      </div>

      <div className="relative h-72 rounded-2xl bg-slate-50 px-5 pb-10 pt-6">
        <div className="absolute inset-x-5 top-1/4 border-t border-dashed border-slate-200" />
        <div className="absolute inset-x-5 top-1/2 border-t border-dashed border-slate-200" />
        <div className="absolute inset-x-5 top-3/4 border-t border-dashed border-slate-200" />

        <div className="relative z-10 flex h-full items-end justify-between gap-4">
          {bars.map((height, index) => {
            const isActive = index === 3;

            return (
              <div key={days[index]} className="flex h-full flex-1 flex-col justify-end gap-3">
                <div className="flex h-full items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-300 hover:opacity-90 ${
                      isActive
                        ? "bg-blue-600 shadow-lg shadow-blue-600/20"
                        : "bg-blue-100"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>

                <span
                  className={`text-center text-xs font-semibold ${
                    isActive ? "text-primary" : "text-slate-400"
                  }`}
                >
                  {days[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}