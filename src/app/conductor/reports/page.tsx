"use client";

import React, { useState } from "react";
import { AlertTriangle, Send, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";
import type { IncidentReport } from "@/types";

export default function ConductorReportsPage() {
  const store = useAppStore();
  const toast = useToast();

  const [type, setType] = useState<"Delay" | "Mechanical" | "Overcrowding" | "Fare Dispute" | "Medical" | "Other">("Delay");
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Report Incomplete", "Please provide both an incident title and detailed description.");
      return;
    }

    store.submitIncidentReport({
      tripId: "TRIP-301",
      conductorName: "Mohamed Bangura",
      type,
      severity,
      title,
      description,
    });

    setTitle("");
    setDescription("");
    toast.success("Incident Report Filed", "Supervisor dispatch and admin operations have been alerted.");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Incident & Operational Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          File traffic delays, mechanical issues, passenger disputes, or route disruptions to central transport control.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Report Submission Form */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            File Shift Report
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="incident-type" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Incident Type
                </label>
                <select
                  id="incident-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as IncidentReport["type"])}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                >
                  <option value="Delay">Traffic / Schedule Delay</option>
                  <option value="Mechanical">Mechanical / AC Fault</option>
                  <option value="Overcrowding">Overcrowding / Capacity</option>
                  <option value="Fare Dispute">Fare / Invalid Pass Dispute</option>
                  <option value="Medical">Passenger Medical Issue</option>
                  <option value="Other">Other Operational Note</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="incident-severity" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Severity Level
                </label>
                <select
                  id="incident-severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as IncidentReport["severity"])}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                >
                  <option value="Low">Low (Informational)</option>
                  <option value="Medium">Medium (Minor Delay)</option>
                  <option value="High">High (Service Disruption)</option>
                  <option value="Critical">Critical (Immediate Dispatch)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="incident-title" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Incident Summary Title
              </label>
              <input
                id="incident-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10-minute delay at City Mall junction"
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="incident-desc" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Detailed Log & Actions Taken
              </label>
              <textarea
                id="incident-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, impacted passengers, and supervisor coordination..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            <Button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500">
              <Send className="h-4 w-4" />
              Submit Incident Report
            </Button>
          </form>
        </div>

        {/* Submitted Incident Reports Stream */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            Recent Filed Reports ({store.incidentReports.length})
          </h2>

          <div className="space-y-3">
            {store.incidentReports.map((rep) => (
              <div
                key={rep.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{rep.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      rep.severity === "Critical" || rep.severity === "High"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {rep.severity} Severity
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{rep.title}</h3>
                <p className="text-slate-600 leading-relaxed">{rep.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{rep.submittedAt} • {rep.conductorName}</span>
                  <span className="font-semibold text-emerald-600">{rep.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
