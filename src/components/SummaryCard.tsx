import React from "react";

type SummaryCardProps = {
  title: string;
  value: string;
  change?: string;
  icon?: string;
  positive?: boolean;
};

const statusStyles = {
  positive: {
    iconContainer: "bg-tertiary-fixed/40 text-on-tertiary-fixed-variant",
    badge: "bg-tertiary-fixed/30 text-on-tertiary-fixed-variant",
    badgeIcon: "task_alt",
  },
  attention: {
    iconContainer: "bg-error-container text-on-error-container",
    badge: "bg-error-container text-on-error-container",
    badgeIcon: "priority_high",
  },
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  icon = "account_balance_wallet",
  positive = true,
}) => {
  const statusStyle = positive ? statusStyles.positive : statusStyles.attention;
  return (
    <div className="flex min-h-[180px] flex-col justify-between rounded-xl border border-slate-200 bg-white/90 p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <span className="text-label-caps uppercase text-slate-400">
            {title}
          </span>
          <span
            className={`material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-xl ${statusStyle.iconContainer}`}
          >
            {icon}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-h2 text-primary">{value}</span>

          {change && (
            <span
              className={`flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${statusStyle.badge}`}
            >
              {change}
              <span className="material-symbols-outlined text-[14px] mr-0.5">
                {statusStyle.badgeIcon}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            positive ? "bg-tertiary-fixed-dim" : "bg-error"
          }`}
          style={{ width: positive ? "72%" : "42%" }}
        />
      </div>
    </div>
  );
};

export default SummaryCard;