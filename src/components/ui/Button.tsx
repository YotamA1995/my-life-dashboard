

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary",
  secondary:
    "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 focus-visible:ring-secondary",
  outline:
    "border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high focus-visible:ring-primary",
  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container-high focus-visible:ring-primary",
  danger:
    "bg-error text-on-error hover:bg-error/90 focus-visible:ring-error",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-label-md",
  md: "h-11 px-4 text-label-lg",
  lg: "h-12 px-5 text-label-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}