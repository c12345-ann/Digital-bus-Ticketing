"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Bus,
  BadgeCheck,
  Clock,
  Phone,
  Mail,
  UserCheck,
  Save,
  CheckCircle2,
  Sparkles,
  QrCode,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Avatar } from "@/components/ui/avatar";

export default function ConductorProfilePage() {
  const toast = useToast();

  const [profileImage, setProfileImage] = useState<string>("");
  const [firstName, setFirstName] = useState("Mohamed");
  const [lastName, setLastName] = useState("Bangura");
  const [email, setEmail] = useState("conductor@example.com");
  const [phone, setPhone] = useState("+23276222333");
  const [badgeNumber, setBadgeNumber] = useState("CND-SL-4412");
  const [licenseNumber, setLicenseNumber] = useState("LIC-TRANS-88901");
  const [assignedBus, setAssignedBus] = useState("BUS-18");
  const [assignedRoute, setAssignedRoute] = useState("Central Terminal to East Station");
  const [supervisorName, setSupervisorName] = useState("Man Conteh (Admin Ops)");
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
      badgeNumber,
      licenseNumber,
      assignedBus,
      assignedRoute,
      supervisorName,
    };

    try { const response=await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }); const result=await response.json(); if(!response.ok)throw new Error(result.message);
      setSaving(false);
      toast.success("Staff Profile Updated", "Conductor profile photo and credentials saved.");
    } catch(error) { setSaving(false); toast.error("Update Failed",error instanceof Error?error.message:"Unable to save profile."); }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Conductor Staff Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload staff credential photo, verify vehicle assignment, and review shift logs.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Editable Staff Form */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <ImageUpload
              currentImage={profileImage}
              name={`${firstName} ${lastName}`}
              label="Staff Identification Photo"
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
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Staff Email</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-500 font-semibold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Staff Badge Number</label>
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-mono font-semibold outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Transit License ID</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-mono font-semibold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Assigned Coach & Line</label>
              <input
                type="text"
                value={`${assignedBus} • ${assignedRoute}`}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-700 font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Supervisor Contact</label>
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-3">
              <Button type="submit" loading={saving} className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-2.5 text-xs">
                Save Staff Credentials
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Official Conductor Credential Badge Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5" /> Certified Conductor
              </span>
              <span className="font-mono text-xs text-slate-400">{badgeNumber}</span>
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
                <p className="text-xs text-emerald-300 font-bold truncate">Assigned: {assignedBus}</p>
                <p className="text-[11px] text-slate-300 truncate">{phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block">Shift Status</span>
                <strong className="text-emerald-400">Active on Duty</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Supervisor</span>
                <strong className="text-white">Man Conteh</strong>
              </div>
            </div>
          </div>

          {/* Operational Metrics Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <QrCode className="h-4 w-4 text-emerald-600" />
              Conductor Validation Performance
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium block">Total Scanned</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">38</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium block">Punctuality</span>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">99.2%</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium block">Shift Hours</span>
                <p className="text-lg font-bold text-blue-600 mt-0.5">6.5h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
