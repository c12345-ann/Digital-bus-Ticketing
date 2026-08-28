"use client";

import React, { useState } from "react";
import { CreditCard, Download, Search, CheckCircle2, Receipt, FileText } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { ReceiptModal } from "@/components/tickets/receipt-modal";
import type { PaymentRecord } from "@/types";

export default function PassengerPaymentHistoryPage() {
  const store = useAppStore();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  const filteredPayments = store.payments.filter(
    (p) =>
      p.transactionRef.toLowerCase().includes(search.toLowerCase()) ||
      p.ticketReference.toLowerCase().includes(search.toLowerCase()) ||
      p.route.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = store.payments
    .filter((p) => p.status === "Successful")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Payment & Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            View transaction ledgers, official tax receipts, and download proof of payment.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Settled</span>
            <p className="text-lg font-bold text-slate-900">NLe {totalSpent}</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by transaction reference, ticket, or route..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
        />
      </div>

      {/* Responsive Payment Records Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Transaction Ref</th>
              <th className="px-6 py-4">Ticket & Route</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Official Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4 font-mono font-bold text-slate-900">
                  {p.transactionRef}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{p.route}</p>
                  <p className="text-[11px] font-mono text-slate-500">{p.ticketReference}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700">
                    <CreditCard className="h-3 w-3 text-blue-600" />
                    {p.method}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{p.date}</td>
                <td className="px-6 py-4 font-extrabold text-slate-900 whitespace-nowrap">
                  NLe {p.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                    <CheckCircle2 className="h-3 w-3" />
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => setSelectedPayment(p)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-sm"
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    Tax Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* High-Fidelity Tax Receipt Modal with PDF Download */}
      <ReceiptModal
        open={!!selectedPayment}
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}
