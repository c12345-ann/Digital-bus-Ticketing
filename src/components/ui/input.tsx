import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ className, error, id, label, required, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="grid gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
        {label} {required ? <span className="text-orange-600">*</span> : null}
      </label>
      <input
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
