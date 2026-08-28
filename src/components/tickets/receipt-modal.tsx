"use client";

import React, { useRef } from "react";
import {
  Bus,
  CheckCircle2,
  Download,
  Printer,
  X,
  CreditCard,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Building,
  FileCheck,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import type { PaymentRecord } from "@/types";

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  passengerName?: string;
  seatNumber?: string;
  busNumber?: string;
  travelDate?: string;
}

export function ReceiptModal({
  open,
  onClose,
  payment,
  passengerName = "Aminata Kamara",
  seatNumber = "12A",
  busNumber = "BUS-18",
  travelDate = "Aug 16, 2026",
}: ReceiptModalProps) {
  const toast = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate simulated PDF receipt download
    toast.success(
      "Receipt Downloaded",
      `Official receipt ${payment.transactionRef}.pdf has been saved to your downloads.`
    );
  };

  const baseFare = payment.amount;
  const transitLevy = Math.round(baseFare * 0.05 * 10) / 10;
  const subTotal = baseFare - transitLevy;

  return (
    <Modal open={open} title="Electronic Payment Receipt" onClose={onClose}>
      <div className="space-y-6">
        {/* Printable Receipt Container */}
        <div
          ref={receiptRef}
          id="official-receipt"
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-md text-slate-800 text-xs space-y-6 print:border-none print:shadow-none"
        >
          {/* Watermark Stamp */}
          <div className="pointer-events-none absolute right-6 top-20 select-none opacity-[0.08] rotate-[-20deg]">
            <div className="border-8 border-emerald-600 rounded-3xl p-6 text-center">
              <span className="text-4xl font-extrabold tracking-widest text-emerald-950 uppercase block">
                PAID & VERIFIED
              </span>
              <span className="text-sm font-bold tracking-widest text-emerald-800 block mt-1">
                SIERRA TRANSIT AUTHORITY
              </span>
            </div>
          </div>

          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-sm">
                  <Bus className="h-4 w-4" />
                </span>
                <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Sierra Transit Digital Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Central Transport Authority • Freetown Terminal
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Tax ID / VAT: <strong className="text-slate-700">SL-TIN-9940182</strong>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                ✓ Tax Invoice Settled
              </span>
              <p className="font-mono text-sm font-extrabold text-slate-900 mt-1">
                {payment.transactionRef}
              </p>
              <p className="text-[11px] text-slate-400">Date: {payment.date}</p>
            </div>
          </div>

          {/* Customer & Trip Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">Billed To:</span>
              <strong className="text-slate-900 font-semibold">{payment.passengerName || passengerName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Ticket Reference:</span>
              <strong className="font-mono text-blue-700">{payment.ticketReference}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Coach & Seat:</span>
              <strong className="text-slate-900">{busNumber} • Seat {seatNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Channel:</span>
              <strong className="text-emerald-700">{payment.method}</strong>
            </div>
          </div>

          {/* Itemized Fare Table */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              Itemized Fare Statement
            </span>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-2.5">Description</th>
                    <th className="px-4 py-2.5 text-center">Qty</th>
                    <th className="px-4 py-2.5 text-right">Rate</th>
                    <th className="px-4 py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-slate-900">{payment.route}</p>
                      <p className="text-[11px] text-slate-400">Scheduled Journey Pass ({travelDate})</p>
                    </td>
                    <td className="px-4 py-2.5 text-center">1</td>
                    <td className="px-4 py-2.5 text-right">NLe {subTotal.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                      NLe {subTotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-slate-600">
                      Municipal Transit & Safety Levy (5%)
                    </td>
                    <td className="px-4 py-2 text-center">1</td>
                    <td className="px-4 py-2 text-right">NLe {transitLevy.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-900">
                      NLe {transitLevy.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-slate-600">
                      QR Digital Ticketing Platform Fee
                    </td>
                    <td className="px-4 py-2 text-center">1</td>
                    <td className="px-4 py-2 text-right text-emerald-600 font-bold">Waived</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-600">
                      NLe 0.00
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50/80 border-t border-slate-200 font-bold">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-slate-800 text-sm">
                      Total Amount Paid:
                    </td>
                    <td className="px-4 py-3 text-right text-blue-700 text-base font-extrabold font-mono">
                      NLe {payment.amount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Barcode & Authentication Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-semibold text-slate-800">
                Official Electronic Verification Footprint
              </p>
              <p>
                Authorized by Central Ministry of Transport. Retain for tax & refund claims.
              </p>
            </div>

            {/* Simulated Barcode */}
            <div className="flex flex-col items-center">
              <div className="flex h-8 items-stretch gap-[2px] bg-slate-900 p-1 rounded">
                {[1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2].map((w, i) => (
                  <span
                    key={i}
                    className="bg-white"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] text-slate-400 mt-1">
                *{payment.transactionRef}*
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition"
            >
              <Printer className="h-4 w-4 text-slate-600" />
              Print Receipt
            </button>

            <Button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-xs shadow-md shadow-blue-500/20"
            >
              <Download className="h-4 w-4" />
              Download PDF Receipt
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
