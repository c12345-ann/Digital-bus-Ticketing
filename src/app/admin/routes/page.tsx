"use client";

import React, { useState } from "react";
import { MapPin, Plus, Search, Trash2, Edit3, CheckCircle2, AlertCircle, Bus, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { AppRoute } from "@/types";

export default function AdminRoutesPage() {
  const store = useAppStore();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState("35");
  const [departureTime, setDepartureTime] = useState("08:30 AM");
  const [duration, setDuration] = useState("45 min");
  const [busAssigned, setBusAssigned] = useState("BUS-18");

  const filteredRoutes = store.routes.filter(
    (r) =>
      r.origin.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setOrigin("");
    setDestination("");
    setFare("35");
    setDepartureTime("08:30 AM");
    setDuration("45 min");
    setBusAssigned("BUS-18");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: AppRoute) => {
    setEditingId(route.id);
    setOrigin(route.origin);
    setDestination(route.destination);
    setFare(String(route.fare));
    setDepartureTime(route.departureTime);
    setDuration(route.duration);
    setBusAssigned(route.busAssigned || "BUS-18");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      toast.error("Invalid Fields", "Please specify origin and destination.");
      return;
    }

    try {
      if (editingId) {
      await store.updateRoute(editingId, {
        origin,
        destination,
        fare: Number(fare) || 35,
        departureTime,
        duration,
        busAssigned,
      });
      toast.success("Route Updated", `Route ${origin} → ${destination} updated successfully.`);
    } else {
      await store.addRoute({
        origin,
        destination,
        fare: Number(fare) || 35,
        departureTime,
        duration,
        busAssigned,
        status: "active",
        stops: [origin, "Intermediate Junction", destination],
      });
      toast.success("Route Created", `New route ${origin} → ${destination} added to transit network.`);
      }
      setIsModalOpen(false);
    } catch(error) { toast.error("Save Failed",error instanceof Error?error.message:"Unable to save route."); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove route: ${name}?`)) {
      try { await store.deleteRoute(id); toast.info("Route Removed", `Route ${name} was deleted.`); }
      catch(error){toast.error("Delete Failed",error instanceof Error?error.message:"Unable to delete route.");}
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Transit Routes Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure line itineraries, fare pricing, station stops, and assigned buses.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500">
          <Plus className="h-4 w-4" />
          Add New Route
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search routes by origin, destination, or code..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none shadow-sm"
        />
      </div>

      {/* Routes Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">

            <tr>
              <th className="px-6 py-4">Route ID</th>
              <th className="px-6 py-4">Origin → Destination</th>
              <th className="px-6 py-4">Timetable</th>
              <th className="px-6 py-4">Assigned Bus</th>
              <th className="px-6 py-4">Fare</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredRoutes.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4 font-mono font-bold text-purple-700">{r.id.toUpperCase()}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{r.origin} → {r.destination}</p>
                  <p className="text-[11px] text-slate-400">Via: {r.stops?.join(", ") || "Direct Line"}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{r.departureTime} ({r.duration})</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{r.busAssigned || "BUS-18"}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">NLe {r.fare}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                    <CheckCircle2 className="h-3 w-3" />
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition"
                      title="Edit Route"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, `${r.origin} to ${r.destination}`)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition"
                      title="Delete Route"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          title={editingId ? "Edit Route Configuration" : "Add New Transit Route"}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Origin Station</label>
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Central Terminal"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Destination Station</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. East Station"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Fare (NLe)</label>
                <input
                  type="number"
                  required
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Departure Time</label>
                <input
                  type="text"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  placeholder="e.g. 08:30 AM"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 45 min"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Assigned Bus Coach</label>
              <select
                value={busAssigned}
                onChange={(e) => setBusAssigned(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
              >
                {store.buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} ({b.plate} - {b.model})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-500">
                {editingId ? "Update Route" : "Save Route"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
