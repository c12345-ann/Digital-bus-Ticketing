"use client";

import React, { useState } from "react";
import { Users, Plus, Search, ShieldCheck, UserCheck, Shield } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import type { UserRole } from "@/types";
import { useToast } from "@/components/ui/toast-provider";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const store = useAppStore();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"passenger" | "conductor" | "administrator">("passenger");
  const [password, setPassword] = useState("ChangeMe123!");
  const [creating, setCreating] = useState(false);

  const filtered = store.users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error("Invalid Input", "Please fill in all user profile details.");
      return;
    }

    setCreating(true);
    try {
      const response=await fetch("/api/admin/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({firstName,lastName,email,role,password})});
      const payload=await response.json(); if(!response.ok)throw new Error(payload.message);
      await store.refresh(); setIsModalOpen(false);
      toast.success("User Account Created", `Account for ${firstName} ${lastName} created as ${role.toUpperCase()}.`);
    } catch(error) { toast.error("Creation Failed",error instanceof Error?error.message:"Unable to create account."); }
    finally { setCreating(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">User Access & Role Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Control permissions for Passengers, Conductors, and System Administrators.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500">
          <Plus className="h-4 w-4" />
          Create User Account
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search accounts by name, email, or role..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none shadow-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">

            <tr>
              <th className="px-6 py-4">User Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Assigned Role</th>
              <th className="px-6 py-4">Account ID</th>
              <th className="px-6 py-4 text-right">Access Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                <td className="px-6 py-4 text-slate-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      u.role === "administrator"
                        ? "bg-purple-100 text-purple-800"
                        : u.role === "conductor"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {u.role === "administrator" ? (
                      <Shield className="h-3 w-3" />
                    ) : u.role === "conductor" ? (
                      <UserCheck className="h-3 w-3" />
                    ) : (
                      <Users className="h-3 w-3" />
                    )}
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-slate-400">{u.id}</td>
                <td className="px-6 py-4 text-right font-semibold text-slate-700">
                  {u.role === "administrator" ? "Full Superadmin Access" : u.role === "conductor" ? "Validation Terminal Access" : "Passenger Booking Portal"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          title="Create System User"
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Bangura"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">User Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Temporary Password</label>
              <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500" />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-purple-500"
              >
                <option value="passenger">Passenger (Booking & Wallet)</option>
                <option value="conductor">Conductor (Scanner & Manifest)</option>
                <option value="administrator">Administrator (Full Control)</option>
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
                Create Account
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
