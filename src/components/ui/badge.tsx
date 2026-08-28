import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "blue" | "green" | "orange" | "slate";
  className?: string;
};

const toneClasses = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-green-200 bg-green-50 text-green-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  slate: "border-slate-200 bg-slate-100 text-slate-700",
};

export function Badge({ children, tone = "slate", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
