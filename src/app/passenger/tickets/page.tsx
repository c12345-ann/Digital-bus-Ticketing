"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Ticket, Search, Plus, Filter, AlertCircle } from "lucide-react";

import { useAppStore } from "@/lib/store/app-store";
import { TicketPreview } from "@/components/tickets/ticket-preview";
import { useToast } from "@/components/ui/toast-provider";

export default function PassengerTicketsPage() {
  const store = useAppStore();
  const toast = useToast();
  const [filterStatus, setFilterStatus] = useState<"all" | "unused" | "used" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCancelTicket = async (id: string) => {
    if (confirm("Are you sure you want to cancel this ticket and request a refund?")) {
      try {
        const ok = await store.cancelTicket(id);
        if (!ok) throw new Error("Only unused tickets can be cancelled.");
        toast.info("Ticket Cancelled", "Ticket has been cancelled and refund initiated.");
      } catch (error) {
        toast.error("Cancellation Failed", error instanceof Error ? error.message : "Unable to cancel ticket.");
      }
    }
  };

  const filteredTickets = useMemo(() => {
    return store.tickets.filter((t) => {
      const matchesStatus = filterStatus === "all" || t.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.passengerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [store.tickets, filterStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Digital Ticket Wallet</h1>
          <p className="mt-1 text-sm text-slate-500">
            Access your QR boarding passes, verify seat allocations, or download receipts.
          </p>
        </div>
        <Link
          href="/passenger/book-ticket"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
        >
          <Plus className="h-4 w-4" />
          Book Another Ticket
        </Link>
      </div>

      {/* Filter Tabs & Search Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "all" as const, label: `All (${store.tickets.length})` },
            { key: "unused" as const, label: `Active (${store.tickets.filter((t) => t.status === "unused").length})` },
            { key: "used" as const, label: `Boarded (${store.tickets.filter((t) => t.status === "used").length})` },
            { key: "cancelled" as const, label: `Cancelled (${store.tickets.filter((t) => t.status === "cancelled").length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                filterStatus === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket ref, route..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </div>

      {/* Ticket List */}
      {filteredTickets.length > 0 ? (
        <div className="grid gap-6">
          {filteredTickets.map((ticket) => (
            <TicketPreview
              key={ticket.id}
              ticket={ticket}
              onCancel={handleCancelTicket}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Ticket className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 font-bold text-slate-800 text-base">No tickets matching your filter</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery ? "Try refining your search terms." : "You do not have any tickets in this category."}
          </p>
          <Link
            href="/passenger/book-ticket"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-sm"
          >
            Book New Ticket
          </Link>
        </div>
      )}
    </div>
  );
}
