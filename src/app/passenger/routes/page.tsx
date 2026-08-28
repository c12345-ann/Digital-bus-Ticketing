"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bus, Clock, MapPin, Search, ArrowRight, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";

export default function PassengerRoutesPage() {
  const store = useAppStore();
  const [search, setSearch] = useState("");

  const filteredRoutes = store.routes.filter(
    (r) =>
      r.origin.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Transit Route Timetable</h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse city transit lines, intermediate station stops, scheduled departures, and fares.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by origin, destination, or route code..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
        />
      </div>

      {/* Route Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-blue-700">
                    {route.id.toUpperCase()}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    {route.origin} → {route.destination}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-blue-700">NLe {route.fare}</p>
                  <p className="text-xs text-slate-500 font-medium">{route.duration}</p>
                </div>
              </div>

              {/* Station Stops Timeline */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Intermediate Station Stops
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                  {route.stops && route.stops.length > 0 ? (
                    route.stops.map((stop, i) => (
                      <span key={stop} className="flex items-center gap-1.5 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {stop}
                        {i < route.stops!.length - 1 && <span className="text-slate-300 ml-1">→</span>}
                      </span>
                    ))
                  ) : (
                    <span>Direct non-stop service</span>
                  )}
                </div>
              </div>

              {/* Transit Details Strip */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Departs: <strong className="text-slate-900">{route.departureTime}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bus className="h-4 w-4 text-emerald-600" />
                  <span>Assigned: <strong className="text-slate-900">{route.busAssigned || "BUS-18"}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Operating: {route.operatingDays || "Daily"}
              </span>

              <Link
                href={`/passenger/book-ticket?routeId=${route.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-sm"
              >
                Book This Line
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
