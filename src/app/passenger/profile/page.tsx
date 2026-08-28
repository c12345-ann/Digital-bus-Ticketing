"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  Ticket,
  Calendar,
  Sparkles,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Avatar } from "@/components/ui/avatar";

export default function PassengerProfilePage() {
  const toast = useToast();

  const [profileImage, setProfileImage] = useState<string>("");
  const [firstName, setFirstName] = useState("Aminata");
  const [lastName, setLastName] = useState("Kamara");
  const [email, setEmail] = useState("passenger@example.com");
  const [phone, setPhone] = useState("+23276123456");
  const [nationalId, setNationalId] = useState("SL-PAS-992140");
  const [emergencyContact, setEmergencyContact] = useState("Abu Kamara (+23276999000)");
  const [preferredSeat, setPreferredSeat] = useState("Window Seat");
  const [preferredPayment, setPreferredPayment] = useState("Orange Money");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profile").then((r)=>r.json()).then(({user})=>{if(!user)return;setProfileImage(user.avatarUrl||"");setFirstName(user.firstName||"");setLastName(user.lastName||"");setEmail(user.email||"");setPhone(user.phone||"");setNationalId(user.nationalId||"");setEmergencyContact(user.emergencyContact||"");}).catch(()=>toast.error("Profile Unavailable","Unable to load your profile."));
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
      nationalId,
      emergencyContact,
      preferredSeat,
      preferredPayment,
    };

    try { const response=await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }); const result=await response.json(); if(!response.ok)throw new Error(result.message);
      setSaving(false);
      toast.success("Profile Updated", "Your passenger profile photo and preferences have been saved.");
    } catch(error) { setSaving(false); toast.error("Update Failed",error instanceof Error?error.message:"Unable to save profile."); }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Passenger Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload your personal rider photo, update contact information, and configure travel preferences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Editable Profile Form */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-6">
          {/* Real Photo Upload Component */}
          <div className="border-b border-slate-100 pb-5">
            <ImageUpload
              currentImage={profileImage}
              name={`${firstName} ${lastName}`}
              label="Passenger Profile Photo"
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
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-500 font-semibold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">National Verification ID</label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-mono font-semibold outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Emergency Contact Person & Phone</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. Abu Kamara (+232...)"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-blue-500"
              />
            </div>

            {/* Travel Preferences */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Travel & Seating Preferences
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Seating Preference</label>
                  <select
                    value={preferredSeat}
                    onChange={(e) => setPreferredSeat(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-blue-500"
                  >
                    <option value="Window Seat">Window Seat (A & D)</option>
                    <option value="Aisle Seat">Aisle Seat (B & C)</option>
                    <option value="Front Row">Front Row (Quick Exit)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Default Payment Gateway</label>
                  <select
                    value={preferredPayment}
                    onChange={(e) => setPreferredPayment(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 font-semibold outline-none focus:border-blue-500"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="Africell Money">Africell Money</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="Apple Pay">Apple Pay</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" loading={saving} className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-2.5 text-xs">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Rider Badge & Travel Stats */}
        <div className="space-y-6">
          {/* Passenger Digital Identity Badge */}
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Verified Passenger
              </span>
              <span className="font-mono text-xs text-slate-400">ID: {nationalId}</span>
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
                <p className="text-xs text-slate-300 truncate">{phone}</p>
                <p className="text-xs text-blue-300 mt-0.5 truncate">{email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block">Preferred Seating</span>
                <strong className="text-white">{preferredSeat}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Default Payment</span>
                <strong className="text-emerald-400">{preferredPayment}</strong>
              </div>
            </div>
          </div>

          {/* Travel Stats Cards */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="h-4 w-4 text-blue-600" />
              Rider Travel Statistics
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium block">Total Trips</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">8</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium block">Active Passes</span>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">2</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-slate-400 font-medium block">Rider Points</span>
                <p className="text-lg font-bold text-purple-600 mt-0.5">320</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
