"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Shield,
  Key,
  Lock,
  UserCheck,
  Phone,
  Mail,
  Save,
  CheckCircle2,
  Sparkles,
  Server,
  Activity,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Avatar } from "@/components/ui/avatar";

export default function AdminProfilePage() {
  const toast = useToast();

  const [profileImage, setProfileImage] = useState<string>("");
  const [firstName, setFirstName] = useState("Man");
  const [lastName, setLastName] = useState("Conteh");
  const [email, setEmail] = useState("admin@example.com");
  const [phone, setPhone] = useState("+23276333444");
  const [adminId, setAdminId] = useState("ADM-HQ-001");
  const [department, setDepartment] = useState("Central Transit Executive Authority");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profile").then((r)=>r.json()).then(({user})=>{if(!user)return;setProfileImage(user.avatarUrl||"");setFirstName(user.firstName||"");setLastName(user.lastName||"");setEmail(user.email||"");setPhone(user.phone||"");}).catch(()=>toast.error("Profile Unavailable","Unable to load your profile."));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      profileImage,
      firstName,
      lastName,
      email,
      phone,
      adminId,
      department,
      twoFactorEnabled,
    };

    try { const response=await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }); const result=await response.json(); if(!response.ok)throw new Error(result.message);
      setSaving(false);
      toast.success("Administrator Profile Updated", "Executive credentials and photo saved.");
    } catch(error) { setSaving(false); toast.error("Update Failed",error instanceof Error?error.message:"Unable to save profile."); }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Administrator Profile & Security</h1>
        <p className="mt-1 text-sm text-slate-500">
          Executive credentials, role permissions, two-factor authentication, and system access rights.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Editable Admin Form */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <ImageUpload
              currentImage={profileImage}
              name={`${firstName} ${lastName}`}
              label="Executive Identification Photo"
              onImageChange={(dataUrl) => setProfileImage(dataUrl)}
              onImageRemove={() => setProfileImage("")}
            />
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Official Email</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-500 font-semibold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Executive Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Department / Authority</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Security Clearance Level</label>
              <input
                type="text"
                disabled
                value="Level 5 • Superadmin Full Access (All Transit Modules)"
                className="w-full rounded-xl border border-purple-200 bg-purple-50/50 p-2.5 text-purple-900 font-bold outline-none"
              />
            </div>

            <div className="pt-3">
              <Button type="submit" loading={saving} className="w-full bg-purple-600 hover:bg-purple-500 font-bold py-2.5 text-xs">
                Save Administrator Profile
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Executive Credential Card & Security State */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-purple-300 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-400/30 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Superadmin Authority
              </span>
              <span className="font-mono text-xs text-slate-400">{adminId}</span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Avatar
                src={profileImage}
                name={`${firstName} ${lastName}`}
                size="lg"
                className="ring-4 ring-white/20"
              />
              <div className="min-w-0">
                <h3 className="text-xl font-extrabold text-white truncate">{firstName} {lastName}</h3>
                <p className="text-xs text-purple-300 font-bold truncate">System Superadministrator</p>
                <p className="text-[11px] text-slate-300 truncate">{department}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block">2FA Multi-Factor</span>
                <strong className="text-emerald-400">Enforced & Active</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Audit Logging</span>
                <strong className="text-white">Full Retention</strong>
              </div>
            </div>
          </div>

          {/* Security & Access Rights */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Key className="h-4 w-4 text-purple-600" />
              Administrative Permissions
            </h3>

            <div className="space-y-2 text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Fleet & Route Creation:</span>
                <span className="font-bold text-emerald-600">Authorized</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Conductor Staff Management:</span>
                <span className="font-bold text-emerald-600">Authorized</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Financial Reconciliation & Refunds:</span>
                <span className="font-bold text-emerald-600">Authorized</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>System Role & RBAC Assignment:</span>
                <span className="font-bold text-emerald-600">Superadmin Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
