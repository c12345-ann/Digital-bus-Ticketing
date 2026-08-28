"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bus,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Timer,
  Users,
  Wifi,
  Zap,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { TicketPreview } from "@/components/tickets/ticket-preview";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { appConfig } from "@/lib/constants";
import { useAppStore } from "@/lib/store/app-store";
import type { DigitalTicket, UserRole } from "@/types";

const liveTicketSample: DigitalTicket = {
  id: "ticket-hero",
  reference: "BT-2026-8841",
  passengerName: "Aminata Kamara",
  passengerPhone: "+23276123456",
  routeId: "rt-001",
  route: "Central Terminal to East Station",
  origin: "Central Terminal",
  destination: "East Station",
  departureTime: "08:30 AM",
  travelDate: "Aug 16, 2026",
  fare: 35,
  seatNumber: "12A",
  busNumber: "BUS-18",
  status: "unused",
  purchasedAt: "2026-08-16 07:15",
  paymentMethod: "Orange Money",
};

const faqs = [
  {
    q: "How does the digital QR ticket work?",
    a: "When you book a ticket online, the system instantly generates a secure digital pass with a verifiable QR code. Show this QR code to the conductor upon boarding to be scanned and checked in seconds.",
  },
  {
    q: "Can I board if my phone battery dies or internet is down?",
    a: "Yes! Every digital pass includes a human-readable unique reference number (e.g., BT-2026-0148). The conductor can manually verify your booking on their offline-ready terminal or passenger manifest.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support Orange Money, Africell Money, Debit/Credit Cards, Bank Transfer, Apple Pay, and Cash on Board payment confirmations.",
  },
  {
    q: "How do conductors validate tickets?",
    a: "Conductors use the Conductor Console equipped with a live camera viewfinder QR scanner and instant manifest check to validate boarding passes and prevent duplicate reuse.",
  },
];

export default function Home() {
  const store = useAppStore();
  const [searchOrigin, setSearchOrigin] = useState("Central Terminal");
  const [searchDestination, setSearchDestination] = useState("East Station");
  const [searchDate, setSearchDate] = useState("2026-08-16");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Available origins and destinations from live routes
  const origins = Array.from(new Set(store.routes.map((r) => r.origin)));
  const destinations = Array.from(new Set(store.routes.map((r) => r.destination)));

  // Matched route for interactive fare calculator
  const matchedRoute = store.routes.find(
    (r) =>
      r.origin.toLowerCase() === searchOrigin.toLowerCase() &&
      r.destination.toLowerCase() === searchDestination.toLowerCase()
  ) || store.routes[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white">
      <SiteHeader />

      <main id="main-content">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 pb-20 pt-12 lg:pt-16">
          {/* Subtle Background Glows */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[100px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              {/* Left Column: Value Prop */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  Next-Generation Transit & QR Ticketing
                </div>

                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                  Instant Digital <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Bus Tickets</span> & Real-Time Fleet Tracking
                </h1>

                <p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg leading-relaxed">
                  Book bus seats online in seconds, receive an instant digital QR boarding pass, and experience fast contactless boarding with our live conductor validation system.
                </p>

                {/* Primary CTA Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/passenger/book-ticket"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Book a Ticket Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/conductor/scan"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition backdrop-blur-sm"
                  >
                    <QrCode className="h-4 w-4 text-emerald-400" />
                    Conductor Scanner HUD
                  </Link>

                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 px-5 py-3.5 text-sm font-semibold text-slate-400 hover:text-slate-200 transition"
                  >
                    <LayoutDashboard className="h-4 w-4 text-purple-400" />
                    Admin Portal
                  </Link>
                </div>

                {/* Live Stats Counter Strip */}
                <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-8">
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">
                      {store.routes.length}+
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Active Routes</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      &lt; 3 sec
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Boarding Scan Speed</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                      100%
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Paperless Workflow</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Digital Boarding Pass Showcase */}
              <div className="relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      Live Boarding Pass Preview
                    </span>
                    <span className="text-xs font-medium text-blue-400">Instant QR Verification</span>
                  </div>

                  <TicketPreview ticket={liveTicketSample} showActions={false} />

                  {/* Conductor HUD Banner */}
                  <div className="rounded-xl border border-slate-700/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <BadgeCheck className="h-6 w-6" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-400">Conductor Live Status</p>
                          <p className="text-sm font-bold text-white">Scanner Online • Bus BUS-18</p>
                        </div>
                      </div>
                      <Link
                        href="/conductor/scan"
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                      >
                        Open Scanner
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ROUTE SEARCH & INSTANT FARE CALCULATOR WIDGET */}
        <section className="relative -mt-8 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-700/80 bg-slate-800/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-400" />
                Find Routes & Calculate Fare
              </h2>
              <span className="text-xs text-slate-400">Instant booking confirmation</span>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {/* Origin */}
              <div>
                <label htmlFor="origin-select" className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Departure From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    id="origin-select"
                    value={searchOrigin}
                    onChange={(e) => setSearchOrigin(e.target.value)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900/90 pl-9 pr-3 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    {origins.map((orig) => (
                      <option key={orig} value={orig}>
                        {orig}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div>
                <label htmlFor="destination-select" className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Destination To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                  <select
                    id="destination-select"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900/90 pl-9 pr-3 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    {destinations.map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="travel-date" className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Travel Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="travel-date"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-900/90 pl-9 pr-3 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
              </div>

              {/* Estimated Fare & Action */}
              <div className="flex items-end gap-3">
                <div className="flex-1 rounded-xl border border-blue-500/30 bg-blue-950/40 p-2.5 text-center">
                  <p className="text-[11px] font-medium text-blue-300 uppercase">Estimated Fare</p>
                  <p className="text-lg font-bold text-white">NLe {matchedRoute?.fare || 35}</p>
                </div>

                <Link
                  href={`/passenger/book-ticket?routeId=${matchedRoute?.id || "rt-001"}&date=${searchDate}`}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 shrink-0"
                >
                  Book Seat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* THREE WORKSPACE HUBS */}
        <section id="roles" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 scroll-mt-20">

          <div className="text-center max-w-3xl mx-auto">
            <Badge tone="blue" className="w-fit mx-auto">
              Role-Based Workspaces
            </Badge>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
              Engineered for Every Transport Stakeholder
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Dedicated interfaces tailored for passengers, transit conductors, and transport authority administrators.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Passenger Portal Card */}
            <div className="group relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition">
                <TicketCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Passenger Portal</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Choose routes, reserve specific seats on the interactive bus layout, view QR passes in your wallet, and manage payment receipts.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  Interactive Bus Seat Selector
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  Digital QR Ticket Wallet & PDF Downloads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  Payment History & Route Timetables
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href="/passenger/dashboard"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                >
                  Enter Passenger Portal
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Conductor Console Card */}
            <div className="group relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white transition">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Conductor Console</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Scan passenger QR boarding passes with an animated laser viewfinder, verify seat allocations, track manifest, and submit trip delay logs.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  High-Tech Camera & Reference QR Scanner
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Live Passenger Manifest & Check-In
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Trip Status Control & Incident Reporting
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href="/conductor/dashboard"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                >
                  Enter Conductor Console
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Administrator Portal Card */}
            <div className="group relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 group-hover:bg-purple-600 group-hover:text-white transition">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Admin Dashboard</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Executive transport control center: configure bus routes, fares, active fleet inventory, staff conductor assignments, and revenue reports.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400" />
                  Full CRUD: Routes, Buses, Conductors, Users
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400" />
                  Real-time Revenue & Validation Charts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400" />
                  Fleet Utilization & Financial Exports
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link
                  href="/admin/dashboard"
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
                >
                  Enter Admin Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE ROUTE TIMETABLE & CATALOG */}
        <section id="routes" className="border-y border-slate-800 bg-slate-950/60 py-16 scroll-mt-20">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <Badge tone="orange" className="w-fit">
                  Network Network Catalog
                </Badge>
                <h2 className="mt-3 text-3xl font-extrabold text-white">
                  Available Scheduled Bus Routes
                </h2>
              </div>
              <p className="text-sm text-slate-400 max-w-md">
                Direct connections across central transit stations with live seat booking and scheduled departure times.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {store.routes.map((route) => (
                <div
                  key={route.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-blue-400">
                        {route.id.toUpperCase()}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-white">
                        {route.origin} → {route.destination}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Via: {route.stops?.join(" • ") || "Direct Transit Line"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-400">NLe {route.fare}</p>
                      <p className="text-xs text-slate-400 font-medium">{route.duration}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        {route.departureTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bus className="h-3.5 w-3.5 text-emerald-400" />
                        {route.busAssigned || "BUS-18"}
                      </span>
                    </div>

                    <Link
                      href={`/passenger/book-ticket?routeId=${route.id}`}
                      className="rounded-lg bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition"
                    >
                      Book Ticket
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge tone="blue" className="w-fit mx-auto">
              Got Questions?
            </Badge>
            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-800 bg-slate-800/60 p-5 transition cursor-pointer hover:border-slate-700"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-white text-base">{faq.q}</h3>
                  <span className="text-slate-400 font-bold">{expandedFaq === index ? "−" : "+"}</span>
                </div>
                {expandedFaq === index && (
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed border-t border-slate-700/60 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA STRIP */}
        <section className="border-t border-slate-800 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 py-12 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
            <div>
              <h2 className="text-2xl font-bold">Ready to travel with digital simplicity?</h2>
              <p className="mt-1 text-sm text-slate-300">
                Create an account or login to reserve your ticket in under 60 seconds.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ButtonLink href="/register" variant="primary">
                Register Free
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary">
                Portal Login
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
