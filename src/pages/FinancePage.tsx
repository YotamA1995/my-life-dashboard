

const budgetItems = [
  {
    label: "דיור ושירותים",
    current: "₪1,200",
    budget: "₪1,500",
    width: "80%",
    color: "bg-on-tertiary-container",
  },
  {
    label: "מזון והסעדה",
    current: "₪550",
    budget: "₪600",
    width: "91.6%",
    color: "bg-error",
  },
  {
    label: "בידור",
    current: "₪120",
    budget: "₪400",
    width: "30%",
    color: "bg-tertiary-fixed-dim",
  },
];

const transactions = [
  {
    title: "סופרמרקט",
    subtitle: "כרטיס מסתיים ב-4242",
    category: "מזון",
    date: "24 ביוני, 2024",
    amount: "-₪84.20",
    status: "הושלם",
    icon: "restaurant",
    positive: false,
  },
  {
    title: "שכירות",
    subtitle: "העברה בנקאית",
    category: "דיור",
    date: "01 ביוני, 2024",
    amount: "-₪1,250.00",
    status: "הושלם",
    icon: "home",
    positive: false,
  },
  {
    title: "חברת החשמל",
    subtitle: "חיוב אוטומטי קרוב",
    category: "שירותים",
    date: "05 ביולי, 2024",
    amount: "-₪112.50",
    status: "בהמתנה",
    icon: "bolt",
    positive: false,
    pending: true,
  },
  {
    title: "הכנסה חודשית",
    subtitle: "הפקדה בנקאית",
    category: "הכנסה",
    date: "28 ביוני, 2024",
    amount: "+₪15,000.00",
    status: "הושלם",
    icon: "account_balance",
    positive: true,
  },
];

export default function FinancePage() {
  return (
    <main className="pt-24 px-8 pb-12 max-w-[1440px] mx-auto min-h-screen bg-surface text-on-surface">
      {/* Summary Section */}
      <section className="grid grid-cols-12 gap-gutter mb-margin">
        {/* Total Savings */}
        <article className="col-span-12 lg:col-span-4 bg-white rounded-xl p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-label-caps text-on-surface-variant uppercase tracking-wider">
                סה״כ חסכונות
              </p>
              <h2 className="text-h1 text-primary mt-2">₪24,850</h2>
            </div>

            <div className="p-3 bg-tertiary-fixed-dim/20 rounded-lg">
              <span
                className="material-symbols-outlined text-on-tertiary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                savings
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-on-tertiary-container">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="text-body-sm font-semibold">+12.5% מהחודש שעבר</span>
          </div>
        </article>

        {/* Budget Progress */}
        <article className="col-span-12 lg:col-span-8 bg-white rounded-xl p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-h3 text-primary">הוצאה חודשית מול תקציב</h3>
            <button className="text-secondary text-sm font-semibold flex items-center gap-1 hover:underline">
              צפה בפרטים
              <span className="material-symbols-outlined text-xs rotate-180">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-6">
            {budgetItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <span className="text-body-sm font-medium text-on-surface-variant">
                    {item.label}
                  </span>
                  <span className="text-body-sm font-semibold text-primary">
                    {item.current} / {item.budget}
                  </span>
                </div>
                <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Charts & Insight */}
      <section className="grid grid-cols-12 gap-gutter">
        {/* Spending Trends */}
        <article className="col-span-12 xl:col-span-7 bg-white rounded-xl p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-h3 text-primary">מגמות הוצאות</h3>
              <p className="text-body-sm text-on-surface-variant">
                פעילות לאורך 6 החודשים האחרונים
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-semibold rounded-md border border-outline-variant bg-surface-container text-on-surface">
                שבועי
              </button>
              <button className="px-3 py-1 text-xs font-semibold rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
                חודשי
              </button>
            </div>
          </div>

          <div className="relative h-[300px] w-full flex items-end justify-between px-4 pb-8 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
            <svg
              className="absolute inset-0 h-full w-full px-4 pt-16 pb-8"
              preserveAspectRatio="none"
              viewBox="0 0 1000 100"
            >
              <path
                d="M0,80 Q100,70 200,85 T400,60 T600,40 T800,20 T1000,30"
                fill="none"
                stroke="#00a371"
                strokeWidth="3"
              />
              <path
                d="M0,80 Q100,70 200,85 T400,60 T600,40 T800,20 T1000,30 L1000,100 L0,100 Z"
                fill="url(#financeGradient)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="financeGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#00a371" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00a371" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="flex justify-between w-full absolute bottom-3 left-0 px-6 flex-row-reverse">
              {["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני"].map((month) => (
                <span key={month} className="text-[10px] font-bold text-on-surface-variant uppercase">
                  {month}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Insight + small stats */}
        <aside className="col-span-12 xl:col-span-5 flex flex-col gap-gutter">
          <article className="bg-primary rounded-xl p-card-padding shadow-lg text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.12)]">
            <h4 className="text-label-caps uppercase opacity-70 mb-4">תובנה פיננסית</h4>
            <p className="text-body-lg mb-6">
              חסכת מספיק כדי לכסות <span className="text-tertiary-fixed-dim font-bold">4.2 חודשים</span> של הוצאות חיוניות.
            </p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-lg text-sm font-semibold border border-white/20">
              צפה בניתוח רשת ביטחון
            </button>
          </article>

          <div className="grid grid-cols-2 gap-4">
            <article className="bg-white rounded-xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1">
              <span
                className="material-symbols-outlined text-on-tertiary-container mb-2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
              <p className="text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                חשבונות לתשלום
              </p>
              <p className="text-body-lg font-bold text-primary">₪340</p>
            </article>

            <article className="bg-white rounded-xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1">
              <span
                className="material-symbols-outlined text-error mb-2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <p className="text-[10px] font-bold uppercase text-on-surface-variant mb-1">
                התראות
              </p>
              <p className="text-body-lg font-bold text-primary">2 פעילות</p>
            </article>
          </div>
        </aside>

        {/* Transactions */}
        <article className="col-span-12 bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div className="p-card-padding flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-h3 text-primary">עסקאות אחרונות</h3>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex items-center bg-surface-container-low rounded-lg px-4 py-2 border border-outline-variant w-full md:w-64">
                <span className="material-symbols-outlined text-outline text-lg">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                  placeholder="חפש עסקאות..."
                  type="text"
                />
              </div>
              <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-y border-outline-variant/30">
                  <th className="px-8 py-4 text-label-caps text-on-surface-variant uppercase">עסקה</th>
                  <th className="px-8 py-4 text-label-caps text-on-surface-variant uppercase">קטגוריה</th>
                  <th className="px-8 py-4 text-label-caps text-on-surface-variant uppercase">תאריך</th>
                  <th className="px-8 py-4 text-label-caps text-on-surface-variant uppercase">סכום</th>
                  <th className="px-8 py-4 text-label-caps text-on-surface-variant uppercase text-left">סטטוס</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr key={`${transaction.title}-${transaction.date}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600">
                            {transaction.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-primary">{transaction.title}</p>
                          <p className="text-[12px] text-on-surface-variant">{transaction.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-slate-100 text-slate-700">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-body-sm text-on-surface-variant">
                      {transaction.date}
                    </td>
                    <td
                      className={`px-8 py-4 text-body-sm font-bold ${
                        transaction.positive ? "text-on-tertiary-container" : "text-primary"
                      }`}
                    >
                      {transaction.amount}
                    </td>
                    <td className="px-8 py-4 text-left">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          transaction.pending
                            ? "bg-error-container text-on-error-container"
                            : "bg-on-tertiary-container/10 text-on-tertiary-container"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-center">
            <button className="text-body-sm font-semibold text-secondary hover:underline transition-all">
              צפה בכל העסקאות
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}