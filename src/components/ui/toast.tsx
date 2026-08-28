import type { ReactNode } from "react";

import { Alert } from "@/components/ui/alert";

type ToastProps = {
  children: ReactNode;
  title?: string;
  tone?: "success" | "error" | "warning" | "info";
};

export function Toast({ children, title, tone = "info" }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
      <Alert title={title} tone={tone}>
        {children}
      </Alert>
    </div>
  );
}
