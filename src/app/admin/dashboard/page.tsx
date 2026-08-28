"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Bus,
  Users,
  CreditCard,
  QrCode,
  ArrowRight,
  Plus,
  BarChart3,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const store = useAppStore();
  const toast = useToast();

  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newFare, setNewFare] = useState("35");
  const [newTime, setNewTime] = useState("09:00 AM");

  const totalRevenue = store.payments
    .filter((p) => p.status === "Successful")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrigin.trim() || !newDestination.trim()) {
      toast.error("Invalid Route", "Please enter origin and destination stations.");
      return;
    }

    store.addRoute({
      origin: newOrigin,
      destination: newDestination,
      departureTime: newTime,
      duration: "45 min",
      fare: Number(newFare) || 35,
      status: "active",
      stops: [newOrigin, "Central Hub", newDestination],
    });

    setIsAddRouteOpen(false);
    setNewOrigin("");
    setNewDestination("");
    toast.success("Route Created", `New transit line ${newOrigin} → ${newDestination} is live!`);
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-400/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Executive Operations Console • Man Conteh
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              City Transit Fleet & Revenue Management
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Real-time operational visibility across <span className="text-purple-300 font-bold">{store.routes.length} active routes</span>, <span className="text-emerald-400 font-bold">{store.buses.length} fleet coaches</span>, and daily passenger validations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => setIsAddRouteOpen(true)}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
            >
              <Plus className="h-4 w-4" />
              Add Transit Route
            </Button>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <BarChart3 className="h-4 w-4 text-purple-400" />
              Analytics Center
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Revenue
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">NLe {totalRevenue}</p>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">+18.4% this week</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Bus className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Fleet Buses
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{store.buses.length}</p>
          <p className="mt-1 text-xs text-slate-500">100% operational uptime</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tickets Issued
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{store.tickets.length}</p>
          <p className="mt-1 text-xs text-slate-500">Digital QR passes</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Registered Users
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{store.users.length + 1240}</p>
          <p className="mt-1 text-xs text-slate-500">Passengers & staff</p>
        </div>
      </div>

      {/* Interactive Analytics & Live Fleet Monitors */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Revenue & Ridership Trend Visualization */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Weekly Ridership & Revenue Trend</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time daily ticket issuance volume</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
              Live Aggregate
            </span>
          </div>

          {/* Simulated SVG Trend Chart */}
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2 border-b border-slate-100">
              {[
                { day: "Mon", rev: 45, height: "45%" },
                { day: "Tue", rev: 60, height: "60%" },
                { day: "Wed", rev: 75, height: "75%" },
                { day: "Thu", rev: 55, height: "55%" },
                { day: "Fri", rev: 90, height: "90%" },
                { day: "Sat", rev: 95, height: "95%" },
                { day: "Sun", rev: 80, height: "80%" },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full max-w-[36px] bg-purple-100 rounded-t-xl group-hover:bg-purple-200 transition-all flex items-end justify-center pb-1 h-full">
                    <div
                      className="w-full bg-gradient-to-t from-purple-700 to-indigo-500 rounded-t-xl transition-all duration-700 group-hover:from-purple-600 group-hover:to-indigo-400"
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{bar.day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs text-center pt-2">
              <div>
                <span className="text-slate-400 block font-medium">Peak Travel Window</span>
                <strong className="text-slate-900">07:30 AM - 09:30 AM</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Top Revenue Line</span>
                <strong className="text-slate-900">Central → East Station</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Validation Success</span>
                <strong className="text-emerald-600">99.4% Uptime</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Fleet Monitor */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bus className="h-5 w-5 text-blue-600" />
              Live Fleet Monitor ({store.buses.length})
            </h2>
            <Link
              href="/admin/buses"
              className="text-xs font-bold text-purple-600 hover:text-purple-700"
            >
              Manage Fleet →
            </Link>
          </div>

          <div className="space-y-3">
            {store.buses.map((bus) => (
              <div
                key={bus.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{bus.id} • {bus.plate}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      bus.status === "In Service"
                        ? "bg-emerald-100 text-emerald-800"
                        : bus.status === "Ready"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {bus.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-700">{bus.routeName}</p>
                <p className="text-[11px] text-slate-400">
                  Staff: {bus.conductorName || "Unassigned"} • {bus.capacity} Seats
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Route Modal */}
      {isAddRouteOpen && (
        <Modal
          open={isAddRouteOpen}
          title="Create New Transit Line"
          onClose={() => setIsAddRouteOpen(false)}
        >
          <form onSubmit={handleAddRoute} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Origin Station</label>
                <input
                  type="text"
                  required
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  placeholder="e.g. Hill Station"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Destination Station</label>
                <input
                  type="text"
                  required
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  placeholder="e.g. Lumley Beach"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Fare (NLe)</label>
                <input
                  type="number"
                  required
                  value={newFare}
                  onChange={(e) => setNewFare(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Departure Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddRouteOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-500">
                Save & Publish Route
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
