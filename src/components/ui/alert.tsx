import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type AlertTone = "success" | "error" | "warning" | "info";

type AlertProps = {
  children: ReactNode;
  title?: string;
  tone?: AlertTone;
};

const toneClasses = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-orange-200 bg-orange-50 text-orange-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

const toneIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};

export function Alert({ children, title, tone = "info" }: AlertProps) {
  const Icon = toneIcons[tone];

  return (
    <div
      className={cn("flex gap-3 rounded-lg border p-4", toneClasses[tone])}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-sm leading-6">{children}</div>
      </div>
    </div>
  );
}
