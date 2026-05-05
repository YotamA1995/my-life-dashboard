const activities = [
  {
    name: "שרה ג'נקינס",
    action: "שלחה הודעה",
    time: "לפני שעתיים",
    icon: "mail",
  },
  {
    name: "דוד חן",
    action: "אישר הזמנה",
    time: "לפני 5 שעות",
    icon: "person_add",
  },
  {
    name: "אלנה רודריגז",
    action: "שיתפה מסמך",
    time: "אתמול",
    icon: "description",
  },
];

export default function NetworkActivity() {
  return (
    <div className="col-span-12 lg:col-span-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="p-card-padding">
        <h3 className="text-h3 text-primary">פעילות רשת</h3>
        <p className="text-xs text-slate-500">אינטראקציות אחרונות</p>
      </div>

      {/* List */}
      <div className="flex-1">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-card-padding py-3 border-b border-slate-100 hover:bg-slate-50 transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-inner">
              {item.name.slice(0, 1)}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">{item.name}</p>
              <p className="text-[10px] text-slate-400">
                {item.action} • {item.time}
              </p>
            </div>

            <button className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-all duration-200 hover:scale-110">
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50/50 text-center">
        <button className="text-xs font-bold text-blue-600 hover:underline transition-all hover:text-primary">
          הצג הכל
        </button>
      </div>
    </div>
  );
}