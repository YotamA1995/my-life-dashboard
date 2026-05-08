import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label
          htmlFor={id}
          className="text-label-lg font-medium text-on-surface"
        >
          {label}
        </label>
      ) : null}

      <input
        id={id}
        className={`h-11 rounded-xl border border-outline-variant bg-surface px-4 text-body-lg text-on-surface outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-error focus:border-error focus:ring-error/20" : ""
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-body-sm text-error">{error}</p>
      ) : helperText ? (
        <p className="text-body-sm text-on-surface-variant">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
