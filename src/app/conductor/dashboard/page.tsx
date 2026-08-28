"use client";

import React from "react";
import Link from "next/link";
import {
  QrCode,
  Bus,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  TrendingUp,
} from "lucide-react";

import { useAppStore } from "@/lib/store/app-store";

export default function ConductorDashboardPage() {
  const store = useAppStore();

  const assignedTrip = store.trips[0];
  const totalManifest = store.manifestPassengers.length;
  const boardedManifest = store.manifestPassengers.filter((m) => m.isBoarded).length;
  const validationRate = totalManifest > 0 ? Math.round((boardedManifest / totalManifest) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Active Shift • Mohamed Bangura
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Assigned Bus: <span className="text-emerald-400">BUS-18</span> (Central Route)
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Active Trip: <strong className="text-white">{assignedTrip?.route}</strong>. Boarding status is currently <span className="text-emerald-400 font-bold uppercase">{assignedTrip?.status}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/conductor/scan"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
            >
              <QrCode className="h-4 w-4" />
              Launch QR Scanner HUD
            </Link>
            <Link
              href="/conductor/passengers"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <Users className="h-4 w-4 text-emerald-400" />
              Passenger Manifest
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Boarded Passengers
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {boardedManifest} <span className="text-xs text-slate-400 font-normal">/ {totalManifest}</span>
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">{validationRate}% checked-in</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Bus className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Assigned Bus
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">BUS-18</p>
          <p className="mt-1 text-xs text-slate-500">40 Seats • High-speed WiFi</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Clock className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Departure Time
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">08:30 AM</p>
          <p className="mt-1 text-xs text-slate-500">Gate A • Platform 3</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Shift Validations
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{store.validationLogs.length}</p>
          <p className="mt-1 text-xs text-slate-500">Scanned today</p>
        </div>
      </div>

      {/* Grid: Active Trip Timeline + Manifest Quick View */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Active Trip Timeline */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-600">Active Shift Route</span>
              <h2 className="text-xl font-bold text-slate-900">{assignedTrip?.route}</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {assignedTrip?.status}
            </span>
          </div>

          {/* Stop Progress Timeline */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Trip Stop Progress:
            </span>
            <div className="space-y-3">
              {assignedTrip?.stops.map((stop, index) => (
                <div key={stop} className="flex items-start gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        index === 0
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {index < assignedTrip.stops.length - 1 && (
                      <span className="h-6 w-0.5 bg-slate-200 my-0.5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{stop}</p>
                    <p className="text-[11px] text-slate-500">
                      {index === 0 ? "Current Station (Boarding)" : "Upcoming Intermediate Stop"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/conductor/trips"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Manage Trip Status →
            </Link>
            <Link
              href="/conductor/reports"
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Report Trip Delay
            </Link>
          </div>
        </div>

        {/* Passenger Manifest Snapshot */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Manifest Snapshot
            </h2>
            <Link
              href="/conductor/passengers"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View Full ({totalManifest}) →
            </Link>
          </div>

          <div className="space-y-3">
            {store.manifestPassengers.map((passenger) => (
              <div
                key={passenger.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{passenger.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Seat {passenger.seatNumber} • {passenger.ticketReference}
                  </p>
                </div>

                <button
                  onClick={() => store.toggleManifestBoarded(passenger.id, !passenger.isBoarded)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    passenger.isBoarded
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {passenger.isBoarded ? "✓ Boarded" : "Check-in"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
