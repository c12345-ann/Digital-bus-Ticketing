import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-bold text-slate-950">{children}</h2>;
}

export function CardDescription({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-sm leading-6 text-slate-600">{children}</p>;
}
