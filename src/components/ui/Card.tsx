import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

function Card({
  children,
  hoverable = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-outline-variant bg-surface-container shadow-sm transition-all ${paddingClasses[padding]} ${
        hoverable
          ? "hover:-translate-y-0.5 hover:shadow-md"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
export type { CardProps };
