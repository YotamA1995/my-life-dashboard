const bars = [60, 85, 45, 95, 70, 55, 80];
const days = ["שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון"];

export default function ProductivityChart() {
  return (
    <div className="col-span-12 lg:col-span-8 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-card-padding h-[420px] relative group overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-h3 text-primary">קצב פרודוקטיביות</h3>
          <p className="text-slate-500 text-sm">מדדי תפוקה לפי ימים</p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-semibold rounded-md bg-surface-container text-slate-600">
            שבועי
          </button>
          <button className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-600 text-white">
            חודשי
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 flex items-end justify-between gap-3 px-2">
        {bars.map((height, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full rounded-t-lg transition-all duration-300 ${
                index === 3 ? "bg-blue-600" : "bg-blue-50 hover:bg-blue-100"
              }`}
              style={{ height: `${height}%` }}
            />
            <span className="text-xs mt-2 text-slate-400">
              {days[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}