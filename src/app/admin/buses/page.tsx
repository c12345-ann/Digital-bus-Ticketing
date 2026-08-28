"use client";

import React, { useState } from "react";
import { Bus, Plus, Search, Trash2, Edit3, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { BusItem, BusStatus } from "@/types";

export default function AdminBusesPage() {
  const store = useAppStore();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("40");
  const [routeId, setRouteId] = useState(store.routes[0]?.id || "rt-001");
  const [status, setStatus] = useState<BusStatus>("In Service");
  const [conductorName, setConductorName] = useState("Mohamed Bangura");

  const filteredBuses = store.buses.filter(
    (b) =>
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.plate.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setPlate("");
    setModel("Mercedes-Benz Citaro");
    setCapacity("40");
    setRouteId(store.routes[0]?.id || "rt-001");
    setStatus("In Service");
    setConductorName("Mohamed Bangura");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BusItem) => {
    setEditingId(b.id);
    setPlate(b.plate);
    setModel(b.model);
    setCapacity(String(b.capacity));
    setRouteId(b.routeId);
    setStatus(b.status);
    setConductorName(b.conductorName || "Unassigned");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) {
      toast.error("Plate Required", "Please enter registration plate number.");
      return;
    }

    const matchedRoute = store.routes.find((r) => r.id === routeId) || store.routes[0];

    try {
      if (editingId) {
      await store.updateBus(editingId, {
        plate,
        model,
        capacity: Number(capacity) || 40,
        routeId,
        routeName: `${matchedRoute.origin} to ${matchedRoute.destination}`,
        status,
        conductorName,
      });
      toast.success("Bus Updated", `Fleet bus ${plate} updated.`);
    } else {
      await store.addBus({
        plate,
        model,
        capacity: Number(capacity) || 40,
        routeId,
        routeName: `${matchedRoute.origin} to ${matchedRoute.destination}`,
        status,
        conductorName,
        amenities: ["Air Conditioning", "WiFi", "USB Charging"],
      });
      toast.success("Bus Added", `New bus ${plate} enrolled in active fleet.`);
      }
      setIsModalOpen(false);
    } catch(error){toast.error("Save Failed",error instanceof Error?error.message:"Unable to save bus.");}
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove bus ${name} from fleet inventory?`)) {
      try { await store.deleteBus(id); toast.info("Bus Decommissioned", `Bus ${name} removed.`); }
      catch(error){toast.error("Delete Failed",error instanceof Error?error.message:"Unable to delete bus.");}
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Fleet Inventory & Buses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage physical coaches, seating capacities, maintenance states, and assigned lines.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500">
          <Plus className="h-4 w-4" />
          Enroll New Bus
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter fleet by bus ID, plate, or vehicle model..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none shadow-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">

            <tr>
              <th className="px-6 py-4">Bus ID</th>
              <th className="px-6 py-4">Plate & Model</th>
              <th className="px-6 py-4">Assigned Transit Line</th>
              <th className="px-6 py-4">Staff Conductor</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredBuses.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4 font-mono font-bold text-purple-700">{b.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{b.plate}</p>
                  <p className="text-[11px] text-slate-400">{b.model}</p>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800">{b.routeName}</td>
                <td className="px-6 py-4 text-slate-600">{b.conductorName || "Unassigned"}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{b.capacity} Seats</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      b.status === "In Service"
                        ? "bg-emerald-100 text-emerald-800"
                        : b.status === "Ready"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition"
                      title="Edit Bus"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, `${b.id} (${b.plate})`)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition"
                      title="Delete Bus"
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

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          title={editingId ? "Edit Fleet Vehicle" : "Enroll New Bus Vehicle"}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">License Plate</label>
                <input
                  type="text"
                  required
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="e.g. SL-1842"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Vehicle Model</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Volvo 7900 Hybrid"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Seating Capacity</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Operational Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BusStatus)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                >
                  <option value="In Service">In Service</option>
                  <option value="Ready">Ready (Standby)</option>
                  <option value="Maintenance">Maintenance Required</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Assigned Route Line</label>
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
              >
                {store.routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.origin} → {r.destination} ({r.departureTime})
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
                {editingId ? "Update Vehicle" : "Save Vehicle"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
