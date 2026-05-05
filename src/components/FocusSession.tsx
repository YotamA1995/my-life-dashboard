

const progress = 75;

export default function FocusSession() {
  return (
    <div className="col-span-12 lg:col-span-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-card-padding flex flex-col group relative shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/40 flex items-center justify-center ring-1 ring-tertiary-fixed/40">
          <span className="material-symbols-outlined text-on-tertiary-fixed-variant">
            psychology
          </span>
        </div>

        <div>
          <h3 className="text-h3 text-primary">סשן ריכוז</h3>
          <p className="text-xs text-slate-500">עבודה עמוקה מבוססת AI</p>
        </div>
      </div>

      {/* Circle */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-50 shadow-inner">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              strokeWidth="8"
              className="text-slate-100"
              stroke="currentColor"
              fill="transparent"
            />

            <circle
              cx="64"
              cy="64"
              r="56"
              strokeWidth="8"
              strokeDasharray="351.85"
              strokeDashoffset={351.85 - (351.85 * progress) / 100}
              className="text-blue-600 transition-all duration-700 drop-shadow-sm"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          <div className="absolute text-center">
            <span className="text-2xl font-bold text-primary">45</span>
            <span className="block text-[10px] text-slate-400 uppercase">דקות</span>
          </div>
        </div>

        <p className="mt-6 text-center text-slate-600 px-4 text-sm">
          יש לך חלון פנוי ל<strong> עבודה עמוקה </strong>בין 14:00 ל-15:00
        </p>
      </div>

      {/* Button */}
      <button className="mt-6 w-full py-3 bg-surface-container hover:bg-primary hover:text-white transition-all duration-300 rounded-xl font-bold text-sm text-primary">
        הפעל טיימר
      </button>
    </div>
  );
}