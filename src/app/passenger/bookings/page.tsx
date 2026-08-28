"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight, Bus, Search, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";

export default function PassengerBookingsPage() {
  const store = useAppStore();
  const [search, setSearch] = useState("");

  const filteredBookings = store.tickets.filter(
    (t) =>
      t.reference.toLowerCase().includes(search.toLowerCase()) ||
      t.route.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Booking Records</h1>
          <p className="mt-1 text-sm text-slate-500">
            View booking status, seat reservations, and re-book past routes.
          </p>
        </div>
        <Link
          href="/passenger/book-ticket"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
        >
          <Plus className="h-4 w-4" />
          Book New Trip
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter bookings by reference or route..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
        />
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">

            <tr>
              <th className="px-6 py-4">Booking Ref</th>
              <th className="px-6 py-4">Route & Schedule</th>
              <th className="px-6 py-4">Seat / Bus</th>
              <th className="px-6 py-4">Fare</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-slate-900">{b.reference}</span>
                  <p className="text-[11px] text-slate-400">Paid via {b.paymentMethod}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{b.route}</p>
                  <p className="text-[11px] text-slate-500">{b.travelDate} • {b.departureTime}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[11px]">
                    Seat {b.seatNumber}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{b.busNumber || "BUS-18"}</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">
                  NLe {b.fare}
                </td>
                <td className="px-6 py-4">
                  {b.status === "unused" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="h-3 w-3" />
                      Confirmed
                    </span>
                  ) : b.status === "used" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px]">
                      <AlertCircle className="h-3 w-3" />
                      Cancelled
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/passenger/tickets#ticket-${b.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    View Pass
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
