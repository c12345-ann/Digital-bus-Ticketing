"use client";

import React, { useState } from "react";
import { Ticket, Search, CheckCircle2, AlertTriangle, QrCode } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";

export default function ConductorTicketsPage() {
  const store = useAppStore();
  const [search, setSearch] = useState("");

  const filtered = store.validationLogs.filter(
    (l) =>
      l.ticketReference.toLowerCase().includes(search.toLowerCase()) ||
      l.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      l.route.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Shift Validation Logs</h1>
        <p className="mt-1 text-sm text-slate-500">
          Complete audit history of tickets scanned and verified during this shift on <strong className="text-slate-900">BUS-18</strong>.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter logs by ticket reference, passenger, or route..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">

            <tr>
              <th className="px-6 py-4">Ticket Ref</th>
              <th className="px-6 py-4">Passenger Name</th>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Validation Time</th>
              <th className="px-6 py-4">Conductor / Bus</th>
              <th className="px-6 py-4 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">{log.ticketReference}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{log.passengerName}</td>
                <td className="px-6 py-4">{log.route}</td>
                <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                <td className="px-6 py-4 text-slate-500">{log.conductorName} ({log.bus})</td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      log.status === "Valid"
                        ? "bg-emerald-100 text-emerald-800"
                        : log.status === "Already Used"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {log.status === "Valid" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
