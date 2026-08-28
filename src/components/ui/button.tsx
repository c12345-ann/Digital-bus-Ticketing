import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variantClasses = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:outline-blue-600",
  secondary:
    "border border-slate-300 bg-white text-slate-900 shadow-sm hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-blue-600",
  ghost:
    "text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-slate-500",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600",
};

export function Button({
  children,
  className,
  disabled,
  loading,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}
