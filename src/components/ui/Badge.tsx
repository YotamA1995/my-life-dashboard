import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "bg-surface-container-high text-on-surface-variant border-outline-variant",
  primary:
    "bg-primary/10 text-primary border-primary/20",
  success:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-600 border-amber-500/20",
  danger:
    "bg-error/10 text-error border-error/20",
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-label-sm font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
