import type { Task } from "../store/useTasksStore";

type NetworkActivityProps = {
  tasks: Task[];
};

type ActivityItem = {
  id: string;
  title: string;
  action: string;
  time: string;
  icon: string;
};

function formatRelativeTime(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "לא ידוע";
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.max(0, Math.floor(diffInMs / 60000));

  if (diffInMinutes < 1) {
    return "עכשיו";
  }

  if (diffInMinutes < 60) {
    return `לפני ${diffInMinutes} דקות`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `לפני ${diffInHours} שעות`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays === 1) {
    return "אתמול";
  }

  return `לפני ${diffInDays} ימים`;
}

function getRecentActivities(tasks: Task[]): ActivityItem[] {
  return [...tasks]
    .sort((firstTask, secondTask) => {
      const firstDate = new Date(firstTask.updatedAt).getTime();
      const secondDate = new Date(secondTask.updatedAt).getTime();

      return secondDate - firstDate;
    })
    .map((task) => {
      if (task.status === "done") {
        return {
          id: task.id,
          title: task.title,
          action: "נסגרה",
          time: formatRelativeTime(task.completedAt ?? task.updatedAt),
          icon: "task_alt",
        };
      }

      if (task.status === "inProgress") {
        return {
          id: task.id,
          title: task.title,
          action: "נמצאת בעבודה",
          time: formatRelativeTime(task.updatedAt),
          icon: "pending_actions",
        };
      }

      if (task.priority === "high") {
        return {
          id: task.id,
          title: task.title,
          action: "דורשת טיפול דחוף",
          time: formatRelativeTime(task.updatedAt),
          icon: "priority_high",
        };
      }

      return {
        id: task.id,
        title: task.title,
        action: "עודכנה",
        time: formatRelativeTime(task.updatedAt),
        icon: "edit_note",
      };
    })
    .slice(0, 4);
}

export default function NetworkActivity({ tasks }: NetworkActivityProps) {
  const activities = getRecentActivities(tasks);

  return (
    <div className="col-span-12 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] lg:col-span-4">
      {/* Header */}
      <div className="p-card-padding">
        <h3 className="text-h3 text-primary">פעילות משימות</h3>
        <p className="text-xs text-slate-500">עדכונים אחרונים מהקנבן</p>
      </div>

      {/* List */}
      <div className="flex-1">
        {activities.length > 0 ? (
          activities.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-slate-100 px-card-padding py-3 transition-all duration-200 hover:scale-[1.01] hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500 shadow-inner">
                <span className="material-symbols-outlined text-lg">
                  {item.icon}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-primary">
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-400">
                  {item.action} • {item.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="px-card-padding py-8 text-center text-sm leading-6 text-slate-500">
            אין עדיין פעילות להצגה. כשתעביר משימות לבעבודה, תסגור משימות או
            תסמן משימות דחופות — הן יופיעו כאן.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-4 text-center">
        <button
          type="button"
          className="text-xs font-bold text-blue-600 transition-all hover:text-primary hover:underline"
        >
          הצג הכל
        </button>
      </div>
    </div>
  );
}
