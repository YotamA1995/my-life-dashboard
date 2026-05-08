import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant bg-surface-container-low px-6 py-10 text-center ${className}`}
    >
      {icon ? (
        <div className="mb-4 text-5xl text-on-surface-variant">
          {icon}
        </div>
      ) : null}

      <h3 className="text-title-lg font-semibold text-on-surface">
        {title}
      </h3>

      {description ? (
        <p className="mt-2 max-w-sm text-body-md text-on-surface-variant">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
