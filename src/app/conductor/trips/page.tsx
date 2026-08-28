"use client";

import React, { useState } from "react";
import { Bus, Clock, MapPin, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import type { TripStatus } from "@/types";

export default function ConductorTripsPage() {
  const store = useAppStore();
  const toast = useToast();

  const handleStatusChange = (tripId: string, status: TripStatus) => {
    store.updateTripStatus(tripId, status);
    toast.success("Trip Status Updated", `Trip status changed to ${status}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Shift Trips & Departures</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage assigned departures, update live transit states, and track station progression.
        </p>
      </div>

      <div className="space-y-6">
        {store.trips.map((trip) => (
          <div
            key={trip.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-700">
                    {trip.tripNumber}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                    Bus {trip.bus}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{trip.route}</h2>
                <p className="text-xs text-slate-500">
                  Scheduled Departure: <strong className="text-slate-800">{trip.departureTime}</strong> • Estimated Arrival: <strong className="text-slate-800">{trip.estimatedArrival}</strong>
                </p>
              </div>

              {/* Status Control Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {(["Scheduled", "Boarding", "In Transit", "Arrived", "Delayed"] as TripStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(trip.id, status)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      trip.status === status
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity Gauge & Route Timeline */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Passenger Capacity & Boarding
                </span>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Boarded: {trip.boardedCount} / {trip.bookedSeats} booked seats</span>
                  <span className="text-emerald-700">{Math.round((trip.boardedCount / (trip.totalSeats || 1)) * 100)}% Capacity</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((trip.boardedCount / (trip.totalSeats || 1)) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Stops Progress */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Station Stops Checklist
                </span>
                <div className="space-y-1.5 text-xs">
                  {trip.stops.map((stop, i) => (
                    <div key={stop} className="flex items-center gap-2 text-slate-700 font-medium">
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      <span>{stop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
