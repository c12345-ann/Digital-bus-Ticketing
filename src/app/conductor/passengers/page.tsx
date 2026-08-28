"use client";

import React, { useState } from "react";
import { Users, Search, CheckCircle2, Phone, AlertCircle, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";

export default function ConductorPassengersPage() {
  const store = useAppStore();
  const toast = useToast();
  const [search, setSearch] = useState("");

  const filtered = store.manifestPassengers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ticketReference.toLowerCase().includes(search.toLowerCase()) ||
      p.seatNumber.toLowerCase().includes(search.toLowerCase())
  );

  const boardedCount = store.manifestPassengers.filter((p) => p.isBoarded).length;

  const handleToggle = (id: string, current: boolean, name: string) => {
    store.toggleManifestBoarded(id, !current);
    if (!current) {
      toast.success("Passenger Boarded", `${name} checked in and marked boarded.`);
    } else {
      toast.info("Status Updated", `${name} marked as waiting.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Passenger Boarding Manifest</h1>
          <p className="mt-1 text-sm text-slate-500">
            Assigned Bus: <strong className="text-slate-900">BUS-18</strong> • Central Terminal to East Station
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Boarded Ratio</span>
            <p className="text-lg font-bold text-slate-900">
              {boardedCount} / {store.manifestPassengers.length} <span className="text-xs text-emerald-600">({Math.round((boardedCount / (store.manifestPassengers.length || 1)) * 100)}%)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search passenger by name, ticket ref, seat..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
        />
      </div>

      {/* Manifest Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">

            <tr>
              <th className="px-6 py-4">Seat</th>
              <th className="px-6 py-4">Passenger Name</th>
              <th className="px-6 py-4">Ticket Ref</th>
              <th className="px-6 py-4">Destination Stop</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Boarding Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4 font-mono font-bold text-blue-700 text-sm">
                  {p.seatNumber}
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900">{p.name}</span>
                  {p.specialAssistance && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Assistance Needed
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-slate-600">{p.ticketReference}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">{p.destination}</td>
                <td className="px-6 py-4 text-slate-500">{p.phone}</td>
                <td className="px-6 py-4">
                  {p.isBoarded ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      <CheckCircle2 className="h-3 w-3" />
                      Boarded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">
                      Waiting
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleToggle(p.id, p.isBoarded, p.name)}
                    className={`rounded-xl px-3 py-1.5 font-bold transition text-xs ${
                      p.isBoarded
                        ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                        : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                    }`}
                  >
                    {p.isBoarded ? "Undo Boarding" : "Check-in"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
