"use client";

import React from "react";
import Link from "next/link";
import {
  Ticket,
  CreditCard,
  Clock,
  MapPin,
  ArrowRight,
  Plus,
  Bus,
  CheckCircle2,
  Calendar,
  Sparkles,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import { useAppStore } from "@/lib/store/app-store";
import { TicketPreview } from "@/components/tickets/ticket-preview";
import { Button } from "@/components/ui/button";

export default function PassengerDashboardPage() {
  const store = useAppStore();

  const activeTickets = store.tickets.filter((t) => t.status === "unused");
  const usedTickets = store.tickets.filter((t) => t.status === "used");
  const nextTicket = activeTickets[0];

  const totalSpent = store.payments
    .filter((p) => p.status === "Successful")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome to your passenger hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready for your next journey, Aminata?
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              You have <span className="font-bold text-emerald-400">{activeTickets.length} active digital ticket{activeTickets.length === 1 ? "" : "s"}</span> ready for boarding. Show your QR code at the terminal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/passenger/book-ticket"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-400 transition"
            >
              <Plus className="h-4 w-4" />
              Book New Ticket
            </Link>
            <Link
              href="/passenger/tickets"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <Ticket className="h-4 w-4 text-blue-400" />
              My Ticket Wallet
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Ticket className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Tickets
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{activeTickets.length}</p>
          <p className="mt-1 text-xs text-slate-500">Ready for boarding</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Trips Completed
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{usedTickets.length}</p>
          <p className="mt-1 text-xs text-slate-500">Validated by conductors</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Spent
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">NLe {totalSpent}</p>
          <p className="mt-1 text-xs text-slate-500">Digital payments</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Bus className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Available Routes
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{store.routes.length}</p>
          <p className="mt-1 text-xs text-slate-500">Live city transit lines</p>
        </div>
      </div>

      {/* Main Grid: Next Upcoming Pass + Quick Booking Shortcuts */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Next Upcoming Pass */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Next Upcoming Boarding Pass
            </h2>
            <Link
              href="/passenger/tickets"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All ({store.tickets.length}) →
            </Link>
          </div>

          {nextTicket ? (
            <TicketPreview ticket={nextTicket} onCancel={async (id) => { await store.cancelTicket(id); }} />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
              <Ticket className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 font-bold text-slate-900">No active tickets</h3>
              <p className="mt-1 text-sm text-slate-500">
                You do not have any upcoming bus tickets. Choose a route and book one in seconds!
              </p>
              <Link
                href="/passenger/book-ticket"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
              >
                Book a Ticket Now
              </Link>
            </div>
          )}
        </div>

        {/* Quick Booking Shortcuts & Popular Routes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bus className="h-5 w-5 text-emerald-600" />
              Quick Re-Book Routes
            </h2>
            <Link
              href="/passenger/routes"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Route Catalog →
            </Link>
          </div>

          <div className="space-y-3">
            {store.routes.slice(0, 3).map((route) => (
              <div
                key={route.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {route.origin} → {route.destination}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Departs {route.departureTime} • {route.duration} • {route.busAssigned || "BUS-18"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600 text-sm">NLe {route.fare}</p>
                    <Link
                      href={`/passenger/book-ticket?routeId=${route.id}`}
                      className="mt-1 inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                    >
                      Book
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Support / Conductor Info Card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-950">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Contactless Travel Guarantee</p>
                <p className="text-blue-800/80 mt-1 leading-relaxed">
                  Conductors verify passes directly from your device screen. No paper printing is ever mandatory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
