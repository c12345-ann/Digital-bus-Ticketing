import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variantClasses = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:outline-blue-600",
  secondary:
    "border border-slate-300 bg-white text-slate-900 shadow-sm hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-blue-600",
  ghost:
    "text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-slate-500",
};

export function ButtonLink({
  href,
  children,
  icon: Icon,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2",
        variantClasses[variant],
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
      {children}
    </Link>
  );
}
