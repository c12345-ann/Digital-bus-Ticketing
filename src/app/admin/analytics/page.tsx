"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  QrCode,
  Bus,
  Users,
  Calendar,
  Download,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const store = useAppStore();
  const toast = useToast();

  const totalRevenue = store.payments
    .filter((p) => p.status === "Successful")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleExport = () => {
    toast.success("Analytics Exported", "Comprehensive ridership & revenue report downloaded (CSV).");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Transit Network Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time ridership demographics, line profitability, payment distribution, and validation metrics.
          </p>
        </div>
        <Button onClick={handleExport} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500">
          <Download className="h-4 w-4" />
          Export Report (CSV)
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Fleet Revenue</span>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">NLe {totalRevenue}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" /> +14.2% month-on-month
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Ticket Fare</span>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">NLe 36.50</p>
          <span className="mt-1 text-xs text-slate-500">Across 4 active lines</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Validation Rate</span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600">98.9%</p>
          <span className="mt-1 text-xs text-slate-500">&lt; 0.2% invalid attempts</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Peak Fleet Capacity</span>
          <p className="mt-2 text-2xl font-extrabold text-blue-600">86.4%</p>
          <span className="mt-1 text-xs text-slate-500">Morning & evening rush</span>
        </div>
      </div>

      {/* Grid: Route Profitability & Payment Methods */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Route Performance Bar Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-base font-bold text-slate-900">Line Ridership & Revenue Distribution</h2>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
              Live Transit Lines
            </span>
          </div>

          <div className="space-y-4">
            {store.routes.map((r, i) => {
              const percentages = [85, 68, 52, 40];
              const pct = percentages[i % percentages.length];

              return (
                <div key={r.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{r.origin} → {r.destination}</span>
                    <span className="text-purple-700 font-mono">NLe {r.fare * 28} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-base font-bold text-slate-900">Digital Payment Gateway Share</h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              100% Cashless Target
            </span>
          </div>

          <div className="space-y-4">
            {[
              { name: "Orange Money (Mobile PIN)", pct: 45, color: "bg-orange-500" },
              { name: "Africell Money (Afrimoney)", pct: 28, color: "bg-red-500" },
              { name: "Visa & Mastercard Cards", pct: 15, color: "bg-blue-600" },
              { name: "Apple Pay & Digital Wallets", pct: 8, color: "bg-slate-900" },
              { name: "Cash on Board Reconciliation", pct: 4, color: "bg-emerald-500" },
            ].map((method) => (
              <div key={method.name} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{method.name}</span>
                  <span className="font-mono">{method.pct}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${method.color}`}
                    style={{ width: `${method.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
