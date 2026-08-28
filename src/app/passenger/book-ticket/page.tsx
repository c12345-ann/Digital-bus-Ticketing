"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bus,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Check,
} from "lucide-react";

import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { TicketPreview } from "@/components/tickets/ticket-preview";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { DigitalTicket, PaymentMethod } from "@/types";


// 40-seat coach layout configuration
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const seatColsLeft = ["A", "B"];
const seatColsRight = ["C", "D"];

export default function PassengerBookTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useAppStore();
  const toast = useToast();

  const initialRouteId = searchParams.get("routeId") || store.routes[0]?.id || "rt-001";
  const initialDate = searchParams.get("date") || new Date().toISOString().split("T")[0];

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRouteId, setSelectedRouteId] = useState(initialRouteId);
  const [travelDate, setTravelDate] = useState(initialDate);
  const [selectedSeat, setSelectedSeat] = useState<string>("12A");
  const [passengerName, setPassengerName] = useState("Aminata Kamara");
  const [passengerPhone, setPassengerPhone] = useState("+23276123456");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Orange Money");
  const [mobileNumber, setMobileNumber] = useState("076123456");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedTicket, setBookedTicket] = useState<DigitalTicket | null>(null);

  const selectedRoute = useMemo(
    () => store.routes.find((r) => r.id === selectedRouteId) || store.routes[0],
    [store.routes, selectedRouteId]
  );
  const occupiedSeats = useMemo(() => store.tickets
    .filter((ticket) => ticket.routeId === selectedRouteId && ticket.travelDate === travelDate && ticket.status !== "cancelled")
    .map((ticket) => ticket.seatNumber), [store.tickets, selectedRouteId, travelDate]);

  const handleSeatClick = (seatCode: string) => {
    if (occupiedSeats.includes(seatCode)) {
      toast.warning("Seat Unavailable", `Seat ${seatCode} is already booked.`);
      return;
    }
    setSelectedSeat(seatCode);
    toast.info("Seat Selected", `Seat ${seatCode} reserved for your trip.`);
  };

  const handleConfirmAndPay = async () => {
    if (!selectedRoute) {
      toast.error("Route Unavailable", "Please wait for routes to load and select an available route.");
      return;
    }
    if (!passengerName.trim() || !passengerPhone.trim()) {
      toast.error("Missing Information", "Please enter passenger name and phone number.");
      return;
    }

    setIsProcessing(true);

    try {
      const ticket = await store.bookTicket({
        passengerName,
        passengerPhone,
        routeId: selectedRoute.id,
        travelDate,
        seatNumber: selectedSeat,
        paymentMethod,
      });

      setBookedTicket(ticket);
      setStep(4);
      toast.success("Booking Confirmed!", `Digital Ticket ${ticket.reference} generated successfully.`);
    } catch (error) {
      toast.error("Booking Failed", error instanceof Error ? error.message : "Unable to book this ticket.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!store.isHydrated) {
    return (
      <div className="mx-auto flex min-h-64 max-w-4xl items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <LoadingSpinner label="Loading routes and seat availability…" />
      </div>
    );
  }

  if (!selectedRoute) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Alert tone="error" title="No routes available">
          {store.error ?? "No active routes were returned by the database. Confirm that the Supabase migration and route seed data were applied."}
        </Alert>
        <Button type="button" onClick={() => void store.refresh()}>
          Retry loading routes
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Book Bus Ticket</h1>
        <p className="mt-1 text-sm text-slate-500">
          Reserve your seat, pay online, and receive an instant digital QR boarding pass.
        </p>
      </div>

      {/* Booking Stepper Progress */}
      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-4 shadow-sm border border-slate-200/80">
        {[
          { num: 1, label: "Route & Date" },
          { num: 2, label: "Choose Seat" },
          { num: 3, label: "Payment" },
          { num: 4, label: "Boarding Pass" },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 rounded-xl p-2.5 transition text-xs font-semibold ${
              step === s.num
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : step > s.num
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "text-slate-400 bg-slate-50"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step === s.num
                  ? "bg-white text-blue-600"
                  : step > s.num
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {step > s.num ? <Check className="h-3.5 w-3.5" /> : s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: ROUTE & SCHEDULE */}
      {step === 1 && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Select Route and Departure Date
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="route-select" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Available Bus Line
              </label>
              <select
                id="route-select"
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              >
                {store.routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.origin} → {route.destination} (Departs {route.departureTime}) • NLe {route.fare}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="travel-date" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Date of Travel
              </label>
              <input
                id="travel-date"
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          {/* Selected Route Summary Card */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-blue-600">Selected Line Summary</span>
                <p className="text-base font-bold text-slate-900">
                  {selectedRoute.origin} → {selectedRoute.destination}
                </p>
                <p className="text-xs text-slate-600">
                  Scheduled Departure: <span className="font-semibold">{selectedRoute.departureTime}</span> • Duration: <span className="font-semibold">{selectedRoute.duration}</span> • Assigned: <span className="font-semibold">{selectedRoute.busAssigned || "BUS-18"}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Ticket Fare</span>
                <p className="text-2xl font-extrabold text-blue-700">NLe {selectedRoute.fare}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2"
            >
              Continue to Seat Selection
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: INTERACTIVE BUS SEAT SELECTOR */}
      {step === 2 && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bus className="h-5 w-5 text-blue-600" />
                Select Your Seat on {selectedRoute.busAssigned || "BUS-18"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any available seat to select. Seat 12A selected by default.
              </p>
            </div>

            {/* Seat Status Legend */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded border border-slate-300 bg-slate-100" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded bg-blue-600 shadow-sm" />
                <span className="font-bold text-blue-700">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded bg-slate-400 opacity-60" />
                <span>Occupied</span>
              </div>
            </div>
          </div>

          {/* Bus Cabin Visual Layout */}
          <div className="mx-auto max-w-md rounded-3xl border-2 border-slate-300 bg-slate-50 p-3 sm:p-6 shadow-inner">
            {/* Front of Bus / Driver Cabin */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-300 pb-3 mb-4 text-xs text-slate-500 font-semibold uppercase">
              <div className="flex items-center gap-1.5 bg-slate-200/80 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs">
                <Bus className="h-3.5 w-3.5 text-slate-700" />
                <span>Driver Cabin</span>
              </div>
              <span className="text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold">
                Entrance Door
              </span>
            </div>

            {/* Seat Grid */}
            <div className="space-y-2.5">
              {rows.map((rowNum) => {
                const rowStr = rowNum < 10 ? `0${rowNum}` : `${rowNum}`;

                return (
                  <div key={rowNum} className="flex items-center justify-between gap-1 sm:gap-4">
                    {/* Left 2 seats (Window A, Aisle B) */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {seatColsLeft.map((col) => {
                        const seatCode = `${rowStr}${col}`;
                        const isOccupied = occupiedSeats.includes(seatCode);
                        const isSelected = selectedSeat === seatCode;

                        return (
                          <button
                            key={seatCode}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatCode)}
                            className={`flex h-9 w-8 sm:h-10 sm:w-11 flex-col items-center justify-center rounded-lg sm:rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105"
                                : isOccupied
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                                : "bg-white text-slate-700 border border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                          >
                            <span>{seatCode}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Center Aisle Indicator */}
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-300">
                      R{rowNum}
                    </div>

                    {/* Right 2 seats (Aisle C, Window D) */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {seatColsRight.map((col) => {
                        const seatCode = `${rowStr}${col}`;
                        const isOccupied = occupiedSeats.includes(seatCode);
                        const isSelected = selectedSeat === seatCode;

                        return (
                          <button
                            key={seatCode}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatCode)}
                            className={`flex h-9 w-8 sm:h-10 sm:w-11 flex-col items-center justify-center rounded-lg sm:rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105"
                                : isOccupied
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                                : "bg-white text-slate-700 border border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                          >
                            <span>{seatCode}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>


            {/* Rear of Bus */}
            <div className="mt-6 border-t-2 border-dashed border-slate-300 pt-3 text-center text-[11px] font-semibold text-slate-400 uppercase">
              Rear Emergency Exit & Luggage
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-600">
                Selected Seat: <span className="font-mono font-bold text-blue-700">{selectedSeat}</span>
              </span>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2"
              >
                Proceed to Payment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PASSENGER DETAILS & PAYMENT */}
      {step === 3 && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Passenger Information & Payment Method
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="passenger-name" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Passenger Full Name
              </label>
              <input
                id="passenger-name"
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                placeholder="e.g. Aminata Kamara"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="passenger-phone" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Mobile Phone Number
              </label>
              <input
                id="passenger-phone"
                type="text"
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                placeholder="e.g. +23276123456"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Choose Payment Method
            </span>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { name: "Orange Money" as const, desc: "Mobile Money PIN" },
                { name: "Africell Money" as const, desc: "Afrimoney Prompt" },
                { name: "Credit/Debit Card" as const, desc: "Visa / Mastercard" },
                { name: "Apple Pay" as const, desc: "Touch / Face ID" },
                { name: "Bank Transfer" as const, desc: "Direct Bank Wire" },
                { name: "Cash on Board" as const, desc: "Pay Conductor" },
              ].map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setPaymentMethod(m.name)}
                  className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition ${
                    paymentMethod === m.name
                      ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900">{m.name}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fare Breakdown Summary Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Standard Route Fare ({selectedRoute.origin} → {selectedRoute.destination}):</span>
              <span className="font-semibold">NLe {selectedRoute.fare}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Seat Reservation ({selectedSeat}):</span>
              <span className="font-semibold text-emerald-600">Included (NLe 0)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Digital QR Ticket Service Fee:</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
              <span>Total Amount to Pay:</span>
              <span className="text-base text-blue-700">NLe {selectedRoute.fare}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Seats
            </button>

            <Button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmAndPay}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500"
            >
              {isProcessing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Authorizing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Confirm & Pay NLe {selectedRoute.fare}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION & BOARDING PASS */}
      {step === 4 && bookedTicket && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-emerald-950">
              Booking Confirmed & Paid!
            </h2>
            <p className="mt-1 text-sm text-emerald-800">
              Your digital boarding pass <span className="font-mono font-bold">{bookedTicket.reference}</span> is active and saved in your wallet.
            </p>
          </div>

          {/* Boarding Pass Render */}
          <TicketPreview ticket={bookedTicket} />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setBookedTicket(null);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              + Book Another Ticket
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/passenger/tickets")}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-md shadow-blue-500/20"
              >
                Go to Ticket Wallet →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
