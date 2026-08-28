"use client";

import React, { useState } from "react";
import { FileText, Download, Calendar, Filter, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const store = useAppStore();
  const toast = useToast();
  const [period, setPeriod] = useState("Today");

  const handleExport = (reportName: string) => {
    toast.success("Report Generated", `${reportName} successfully exported for ${period}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Financial & Audit Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Generate audited statements for fare collection, route performance, and conductor validation logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 shadow-sm"
          >
            <option value="Today">Today (Live Stream)</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month (August 2026)</option>
            <option value="Annual 2026">Annual Fiscal Year 2026</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            id: "RPT-01",
            title: "Daily Fare Revenue Settlement",
            desc: "Full ledger of all ticket sales, payment gateway transaction fees, and net revenue.",
            records: `${store.payments.length} transactions logged`,
            type: "Financial Audit",
          },
          {
            id: "RPT-02",
            title: "Conductor Ticket Validation Logs",
            desc: "Shift-by-shift breakdown of scanned QR boarding passes, boarding timestamps, and bus manifest checks.",
            records: `${store.validationLogs.length} verified scans`,
            type: "Operational Compliance",
          },
          {
            id: "RPT-03",
            title: "Transit Line Route Ridership",
            desc: "Comparative occupancy rates across all 4 city routes with passenger boarding volume.",
            records: `${store.routes.length} active lines analyzed`,
            type: "Route Optimization",
          },
          {
            id: "RPT-04",
            title: "Incident & Delay Audit Report",
            desc: "Catalog of mechanical breakdowns, traffic delays, and dispute resolution reports.",
            records: `${store.incidentReports.length} incidents logged`,
            type: "Fleet Safety",
          },
        ].map((report) => (
          <div
            key={report.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-300 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded">
                  {report.id} • {report.type}
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Export
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{report.desc}</p>
              <p className="text-[11px] font-semibold text-slate-400 pt-2">{report.records}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Period: {period}</span>
              <Button
                onClick={() => handleExport(report.title)}
                className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF / CSV
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
