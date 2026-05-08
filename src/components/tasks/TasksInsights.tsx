

export default function TasksInsights() {
  return (
    <section className="grid grid-cols-12 gap-gutter pb-margin">
      <div className="col-span-12 rounded-xl border border-outline-variant/30 bg-white p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] lg:col-span-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-h3 font-h3 text-on-surface">
            מגמות פרודוקטיביות
          </h3>

          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-secondary"></span>
            <span className="text-body-sm text-on-surface-variant">
              משימות שהושלמו
            </span>
          </div>
        </div>

        <div className="flex h-48 items-end justify-between gap-2 px-2">
          <div className="h-[40%] w-full rounded-t bg-secondary/10 transition-all hover:bg-secondary/30"></div>
          <div className="h-[65%] w-full rounded-t bg-secondary/10 transition-all hover:bg-secondary/30"></div>
          <div className="h-[35%] w-full rounded-t bg-secondary/10 transition-all hover:bg-secondary/30"></div>
          <div className="h-[85%] w-full rounded-t bg-secondary/10 transition-all hover:bg-secondary/30"></div>
          <div className="h-[55%] w-full rounded-t bg-secondary/10 transition-all hover:bg-secondary/30"></div>
          <div className="h-[70%] w-full rounded-t bg-secondary/10 transition-all hover:bg-secondary/30"></div>
          <div className="h-[95%] w-full rounded-t bg-secondary"></div>
        </div>

        <div className="mt-4 flex justify-between px-2 text-label-caps text-on-surface-variant">
          <span>ב'</span>
          <span>ג'</span>
          <span>ד'</span>
          <span>ה'</span>
          <span>ו'</span>
          <span>ש'</span>
          <span>א'</span>
        </div>
      </div>

      <div className="col-span-12 rounded-xl bg-primary p-card-padding text-on-primary shadow-[0px_4px_20px_rgba(0,0,0,0.05)] lg:col-span-4">
        <h3 className="mb-6 text-h3 font-h3">עומס עבודה בצוות</h3>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-1 flex justify-between">
                <span className="text-body-sm font-semibold">דוד חן</span>
                <span className="text-body-sm text-on-primary-container">
                  85%
                </span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-white/20">
                <div
                  className="h-1.5 rounded-full bg-tertiary-fixed-dim"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-1 flex justify-between">
                <span className="text-body-sm font-semibold">ילנה רוסי</span>
                <span className="text-body-sm text-on-primary-container">
                  42%
                </span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-white/20">
                <div
                  className="h-1.5 rounded-full bg-secondary-fixed-dim"
                  style={{ width: "42%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <button className="mt-8 w-full rounded-lg border border-white/20 bg-white/10 py-3 text-body-sm font-semibold transition-all hover:bg-white/20">
          צפה במפת משאבים
        </button>
      </div>
    </section>
  );
}