

import React from "react";

type SummaryCardProps = {
  title: string;
  value: string;
  change?: string; // e.g. "+2.4%"
  icon?: string; // material icon name
  positive?: boolean; // controls color of change
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  icon = "account_balance_wallet",
  positive = true,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-card-padding shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[180px]">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-label-caps text-slate-400 uppercase">{title}</span>
          <span className="material-symbols-outlined text-blue-600">{icon}</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-h2 text-primary">{value}</span>

          {change && (
            <span
              className={`text-xs font-bold flex items-center px-2 py-0.5 rounded-full ${
                positive
                  ? "bg-tertiary-fixed/30 text-on-tertiary-fixed-variant"
                  : "bg-error-container text-on-error-container"
              }`}
            >
              {change}
              <span className="material-symbols-outlined text-[14px] mr-0.5">
                {positive ? "trending_up" : "trending_down"}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Simple sparkline */}
      <div className="mt-6 h-12 w-full">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
          <path
            d="M0 35 Q 25 30, 50 35 T 100 15 T 150 25 T 200 5"
            fill="none"
            stroke="#2170e4"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default SummaryCard;