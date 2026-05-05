

export default function TasksPage() {
  return (
    <main className="pt-24 px-8 pb-12 min-h-screen bg-surface text-on-surface">
      <div className="w-full max-w-[1440px] mx-auto">

        {/* Header */}
        <section className="mb-8">
          <h2 className="text-h1 text-on-surface">מרכז ניהול משימות</h2>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-margin">
          {[
            { label: "משימות פעילות", value: "24" },
            { label: "ממתין לסקירה", value: "08" },
            { label: "הושלמו היום", value: "12", highlight: true },
            { label: "מועד הגשה קרוב", value: "03", danger: true },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-card-padding rounded-xl shadow-sm border border-outline-variant/30"
            >
              <p className="text-label-caps text-on-surface-variant mb-2">
                {item.label}
              </p>
              <h3
                className={`text-h1 ${
                  item.danger
                    ? "text-error"
                    : item.highlight
                    ? "text-on-tertiary-container"
                    : "text-on-surface"
                }`}
              >
                {item.value}
              </h3>
            </div>
          ))}
        </section>

        {/* Kanban */}
        <section className="flex gap-gutter overflow-x-auto pb-8">
          {[
            { title: "לביצוע", count: 8 },
            { title: "בתהליך", count: 4 },
            { title: "בבדיקה", count: 2 },
            { title: "בוצע", count: 15 },
          ].map((col) => (
            <div key={col.title} className="w-80 flex-shrink-0 flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-h3">
                  {col.title}
                  <span className="mr-2 text-sm text-on-surface-variant">
                    {col.count}
                  </span>
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white p-card-padding rounded-xl border border-outline-variant/30 shadow-sm">
                  <h4 className="text-body-md mb-2">משימה לדוגמה</h4>
                  <p className="text-body-sm text-on-surface-variant">
                    12 באוקטובר 2023
                  </p>
                </div>

                <input
                  placeholder="הוסף משימה..."
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-8 bg-white p-card-padding rounded-xl border shadow-sm">
            <h3 className="text-h3 mb-6">מגמות פרודוקטיביות</h3>

            <div className="h-48 flex items-end gap-2">
              {[40, 65, 35, 85, 55, 70, 95].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-secondary/10 rounded-t"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-primary text-white p-card-padding rounded-xl">
            <h3 className="text-h3 mb-6">עומס עבודה בצוות</h3>

            {[85, 42].map((v, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>עובד {i + 1}</span>
                  <span>{v}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className="bg-tertiary-fixed-dim h-1.5 rounded-full"
                    style={{ width: `${v}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}