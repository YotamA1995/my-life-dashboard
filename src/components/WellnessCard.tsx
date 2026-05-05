

const stats = [
  {
    label: "דופק לב",
    value: "72",
    unit: "BPM",
    icon: "favorite",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    label: "צעדים",
    value: "6,432",
    unit: "/ 10k",
    icon: "directions_walk",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "שינה",
    value: "7ש' 20ד'",
    unit: "",
    icon: "nights_stay",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    label: "שתיית מים",
    value: "1.2",
    unit: "ליטר",
    icon: "water_drop",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export default function WellnessCard() {
  return (
    <section className="col-span-12 lg:col-span-8 rounded-xl border border-slate-200 bg-white/90 p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-h3 text-primary">מדדי בריאות</h3>
          <p className="text-sm text-slate-500">ביומטריה יומית</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {stats.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg}`}>
              <span className={`material-symbols-outlined ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {item.icon}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">{item.label}</p>
              <p className="text-lg font-bold text-primary">
                {item.value} <span className="text-xs font-normal">{item.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}