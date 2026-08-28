"use client";

import React, { useState } from "react";
import { Users, Plus, Search, ShieldCheck, Bus, CheckCircle2, Phone, Mail } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function AdminConductorsPage() {
  const store = useAppStore();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [assignedBus, setAssignedBus] = useState("BUS-18");
  const [creating, setCreating] = useState(false);

  const staffList=store.users.filter((user)=>user.role==="conductor").map((user)=>{
    const bus=store.buses.find((item)=>item.conductorId===user.id);
    return {id:user.id,name:user.name,email:user.email,phone:user.phone??"",assignedBus:bus?.id??"Unassigned",assignedRoute:bus?.routeName??"Unassigned",validationsToday:store.validationLogs.filter((log)=>log.conductorName===user.name).length,status:user.accountStatus==="Suspended"?"Suspended":"Active on Duty"};
  });

  const filtered = staffList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.assignedBus.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Required Fields", "Please provide name and email.");
      return;
    }

    setCreating(true);
    try { const parts=name.trim().split(/\s+/);const firstName=parts.shift()??"";const lastName=parts.join(" ")||"User";const r=await fetch("/api/admin/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({firstName,lastName,email,phone,role:"conductor",password:"ChangeMe123!"})});const p=await r.json();if(!r.ok)throw new Error(p.message);await store.updateBus(assignedBus,{conductorId:p.user.id,conductorName:name});await store.refresh();setIsModalOpen(false);toast.success("Staff Enrolled",`Conductor ${name} enrolled and assigned to ${assignedBus}.`);}
    catch(error){toast.error("Enrollment Failed",error instanceof Error?error.message:"Unable to enroll conductor.");}
    finally{setCreating(false);}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Conductor Staff Directory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage ticketing conductors, assigned vehicle shifts, and boarding validation activity.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500">
          <Plus className="h-4 w-4" />
          Enroll Conductor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conductor staff by name, bus, or email..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none shadow-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[650px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">

            <tr>
              <th className="px-6 py-4">Conductor Name</th>
              <th className="px-6 py-4">Assigned Bus & Line</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Today&apos;s Scans</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900">{c.name}</span>
                  <p className="text-[11px] font-mono text-slate-400">{c.id}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{c.assignedBus}</p>
                  <p className="text-[11px] text-slate-500">{c.assignedRoute}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <p>{c.phone}</p>
                  <p className="text-[11px] text-slate-400">{c.email}</p>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">{c.validationsToday} validations</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    <CheckCircle2 className="h-3 w-3" />
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          title="Enroll Conductor Staff"
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samuel Koroma"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Staff Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="conductor@transit.sl"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+232..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Assign Vehicle Coach</label>
              <select
                value={assignedBus}
                onChange={(e) => setAssignedBus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
              >
                <option value="BUS-18">BUS-18 (Central Terminal Line)</option>
                <option value="BUS-21">BUS-21 (Waterfront Line)</option>
                <option value="BUS-14">BUS-14 (Market Square Line)</option>
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
              <Button type="submit" loading={creating} className="bg-purple-600 hover:bg-purple-500">
                Enroll Staff
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
