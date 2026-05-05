

const notificationSettings = [
  {
    title: "סיכומי דוא״ל",
    description: "קבל סיכומים שבועיים של הפעילות המקצועית שלך.",
    icon: "mail",
    iconClassName: "bg-blue-50 text-blue-600",
    enabled: true,
  },
  {
    title: "התראות בזמן אמת",
    description: "התראות שולחן עבודה ונייד למשימות דחופות.",
    icon: "notifications_active",
    iconClassName: "bg-amber-50 text-amber-600",
    enabled: true,
  },
  {
    title: "עדכוני שיווק",
    description: "הישאר מעודכן לגבי מודולים חדשים וטיפים לפרודוקטיביות.",
    icon: "campaign",
    iconClassName: "bg-green-50 text-green-600",
    enabled: false,
  },
];

const modules = [
  { label: "מעקב פיננסי", icon: "account_balance_wallet", enabled: true },
  { label: "יומן חכם", icon: "event_note", enabled: true },
  { label: "אנליטיקה של משימות", icon: "monitoring", enabled: false },
  { label: "פעילות אחרונה", icon: "history", enabled: true },
];

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <button
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? "bg-secondary" : "bg-slate-200"
      }`}
      type="button"
    >
      <span
        className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "right-[22px]" : "right-[2px]"
        }`}
      />
    </button>
  );
}

function SmallToggle({ enabled }: { enabled: boolean }) {
  return (
    <button
      className={`relative h-5 w-9 rounded-full transition-colors ${
        enabled ? "bg-secondary" : "bg-slate-200"
      }`}
      type="button"
    >
      <span
        className={`absolute top-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "right-[18px]" : "right-[2px]"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <main className="pt-24 px-8 pb-12 min-h-screen bg-surface text-on-surface">
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h2 className="text-h1 text-primary">הגדרות והתאמה אישית</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            התאמה אישית של חוויית העבודה, התראות ומודולים פעילים.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main settings */}
          <section className="col-span-12 lg:col-span-8 space-y-8">
            {/* Appearance */}
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
              <div className="border-b border-slate-100 bg-surface-container-low p-card-padding">
                <h3 className="text-h3 text-primary">מראה</h3>
                <p className="text-sm text-on-surface-variant">
                  התאם אישית את מראה הפלטפורמה כך שיתאים לסביבת העבודה שלך.
                </p>
              </div>

              <div className="space-y-8 p-card-padding">
                <div>
                  <label className="mb-4 block text-label-caps text-on-surface-variant">
                    מצב ערכת נושא
                  </label>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <button className="flex flex-col items-center gap-3 rounded-lg border-2 border-secondary bg-secondary/5 p-4 transition-all hover:-translate-y-1" type="button">
                      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                        <div className="absolute inset-y-0 right-0 w-1/4 border-l border-slate-200 bg-slate-100" />
                        <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-secondary" />
                      </div>
                      <span className="text-sm font-semibold text-primary">מצב בהיר</span>
                    </button>

                    <button className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 p-4 transition-all hover:-translate-y-1 hover:border-secondary/40" type="button">
                      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-slate-800 bg-slate-900 shadow-sm">
                        <div className="absolute inset-y-0 right-0 w-1/4 border-l border-slate-800 bg-slate-950" />
                        <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-slate-700" />
                      </div>
                      <span className="text-sm font-medium text-on-surface-variant">מצב כהה</span>
                    </button>

                    <button className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 p-4 transition-all hover:-translate-y-1 hover:border-secondary/40" type="button">
                      <div className="relative aspect-video w-full overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm">
                        <div className="absolute inset-y-0 right-0 w-1/2 border-l border-slate-800 bg-slate-900" />
                      </div>
                      <span className="text-sm font-medium text-on-surface-variant">מערכת</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-4 block text-label-caps text-on-surface-variant">
                    צבע דגש
                  </label>

                  <div className="flex items-center gap-4">
                    <button className="h-10 w-10 rounded-full bg-secondary ring-2 ring-secondary ring-offset-2 transition-transform hover:scale-110" type="button" />
                    <button className="h-10 w-10 rounded-full bg-[#7C3AED] transition-transform hover:scale-110" type="button" />
                    <button className="h-10 w-10 rounded-full bg-[#10B981] transition-transform hover:scale-110" type="button" />
                    <button className="h-10 w-10 rounded-full bg-[#F59E0B] transition-transform hover:scale-110" type="button" />
                    <button className="h-10 w-10 rounded-full bg-[#EF4444] transition-transform hover:scale-110" type="button" />
                    <button className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 transition-colors hover:text-primary" type="button">
                      <span className="material-symbols-outlined text-sm">palette</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Notifications */}
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
              <div className="border-b border-slate-100 bg-surface-container-low p-card-padding">
                <h3 className="text-h3 text-primary">התראות</h3>
                <p className="text-sm text-on-surface-variant">
                  נהל כיצד ומתי תקבל עדכונים ותזכורות.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {notificationSettings.map((item) => (
                  <div key={item.title} className="flex items-center justify-between p-card-padding">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-2 ${item.iconClassName}`}>
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{item.title}</p>
                        <p className="text-sm text-on-surface-variant">{item.description}</p>
                      </div>
                    </div>

                    <Toggle enabled={item.enabled} />
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* Sidebar */}
          <aside className="col-span-12 space-y-8 lg:col-span-4">
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
              <div className="border-b border-slate-100 bg-surface-container-low p-card-padding">
                <h3 className="text-h3 text-primary">מודולים בלוח הבקרה</h3>
                <p className="text-sm text-on-surface-variant">
                  שנה את הניראות של רכיבי המערכת השונים.
                </p>
              </div>

              <div className="space-y-4 p-card-padding">
                {modules.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg bg-surface p-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">{item.icon}</span>
                      <span className="text-primary">{item.label}</span>
                    </div>
                    <SmallToggle enabled={item.enabled} />
                  </div>
                ))}
              </div>
            </article>

            <article className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-primary shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.12)]">
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary-container" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="mb-2 text-label-caps text-tertiary-fixed">סטטוס שדרוג</span>
                <h3 className="mb-2 text-h3 text-white">פתח מודולים של Pro</h3>
                <p className="text-sm text-slate-300">
                  קבל גישה לווידג׳טים מותאמים אישית, סינון מתקדם והיסטוריית ענן ללא הגבלה.
                </p>
                <button className="mt-4 w-fit rounded-lg bg-white px-6 py-2 font-semibold text-primary" type="button">
                  למד עוד
                </button>
              </div>
            </article>
          </aside>
        </div>

        {/* Footer */}
        <section className="mt-12 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>סנכרון הגדרות אחרון: היום ב-09:42 בבוקר</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-lg px-6 py-2 font-semibold text-on-surface-variant transition-colors hover:bg-slate-100" type="button">
              בטל שינויים
            </button>
            <button className="rounded-lg bg-secondary px-8 py-2 font-semibold text-white shadow-md shadow-secondary/20 transition-all hover:opacity-90" type="button">
              שמור שינויים
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}