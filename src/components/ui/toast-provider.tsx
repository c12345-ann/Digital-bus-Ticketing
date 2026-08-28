"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: { type: ToastType; title: string; message?: string; duration?: number }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: { type: ToastType; title: string; message?: string; duration?: number }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => showToast({ type: "success", title, message }), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast({ type: "error", title, message }), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast({ type: "info", title, message }), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast({ type: "warning", title, message }), [showToast]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />;
      case "error":
        return <XCircle className="h-5 w-5 text-rose-600 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600 shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-emerald-200 bg-emerald-50/95 text-emerald-950 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-100";
      case "error":
        return "border-rose-200 bg-rose-50/95 text-rose-950 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-100";
      case "warning":
        return "border-amber-200 bg-amber-50/95 text-amber-950 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-100";
      case "info":
        return "border-blue-200 bg-blue-50/95 text-blue-950 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-100";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in",
              getBorderColor(toast.type)
            )}
          >
            {getIcon(toast.type)}
            <div className="flex-1 text-sm">
              <p className="font-semibold">{toast.title}</p>
              {toast.message && <p className="mt-1 opacity-90 text-xs leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded-md"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
