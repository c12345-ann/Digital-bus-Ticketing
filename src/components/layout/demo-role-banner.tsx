"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, QrCode, Shield, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { useAppStore } from "@/lib/store/app-store";

export function DemoRoleBanner() {
  const router = useRouter();
  const toast = useToast();
  const store = useAppStore();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const demoEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";

  const handleQuickLogin = async (role: "passenger" | "conductor" | "administrator", email: string) => {
    setLoadingRole(role);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Quick login failed");
      }

      toast.success("Switched Role", `Now logged in as ${data.user.name} (${role.toUpperCase()})`);
      router.push(data.redirectTo);
      router.refresh();
    } catch (err: unknown) {
      toast.error("Quick Switch Failed", err instanceof Error ? err.message : "Unable to switch roles.");
    } finally {
      setLoadingRole(null);
    }
  };

  const handleResetData = async () => {
    await store.refresh();
    toast.info("Data Refreshed", "The latest records were loaded from Supabase.");
  };

  if (!demoEnabled) return null;

  return (
    <div className="no-print border-b border-blue-900/60 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-4 py-2 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            <Sparkles className="h-3 w-3" />
          </span>
          <span className="font-semibold text-slate-200">Interactive Demo Workspace:</span>
          <span className="hidden sm:inline text-slate-400">1-click switch between operational roles</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickLogin("passenger", "passenger@example.com")}
            disabled={loadingRole !== null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-600/20 px-2.5 py-1 font-semibold text-blue-300 hover:bg-blue-600/40 hover:text-white transition disabled:opacity-50"
          >
            <User className="h-3 w-3 text-blue-400" />
            Passenger
          </button>

          <button
            onClick={() => handleQuickLogin("conductor", "conductor@example.com")}
            disabled={loadingRole !== null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-600/20 px-2.5 py-1 font-semibold text-emerald-300 hover:bg-emerald-600/40 hover:text-white transition disabled:opacity-50"
          >
            <QrCode className="h-3 w-3 text-emerald-400" />
            Conductor
          </button>

          <button
            onClick={() => handleQuickLogin("administrator", "admin@example.com")}
            disabled={loadingRole !== null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-600/20 px-2.5 py-1 font-semibold text-purple-300 hover:bg-purple-600/40 hover:text-white transition disabled:opacity-50"
          >
            <Shield className="h-3 w-3 text-purple-400" />
            Admin
          </button>

          <button
            onClick={handleResetData}
            title="Refresh database data"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2 py-1 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden md:inline">Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
