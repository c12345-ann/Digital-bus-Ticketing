"use client";

import React, { useEffect, useState } from "react";
import { Bell, ShieldCheck, SlidersHorizontal, Moon, Volume2, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

export function SettingsPage({ title }: { title: string }) {
  const toast = useToast();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [audioChime, setAudioChime] = useState(true);
  const [currency, setCurrency] = useState("NLe (Leone)");
  const [theme, setTheme] = useState("System Default");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/preferences").then((response) => response.json()).then(({ preferences }) => {
      if (!preferences) return;
      setPushEnabled(preferences.push_enabled);
      setEmailAlerts(preferences.email_alerts);
      setAudioChime(preferences.audio_chime);
      setCurrency(preferences.currency);
      setTheme(preferences.theme);
    }).catch(() => toast.error("Settings Unavailable", "Unable to load your saved preferences."));
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response=await fetch("/api/preferences",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({pushEnabled,emailAlerts,audioChime,currency,theme})});
      const payload=await response.json(); if(!response.ok)throw new Error(payload.message);
      toast.success("Preferences Saved", "Your workspace settings have been synchronized.");
    } catch (error) {
      toast.error("Save Failed", error instanceof Error ? error.message : "Unable to save preferences.");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage system notification preferences, regional currencies, audio chimes, and security parameters.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Notifications & Alerts</h2>
              <p className="text-xs text-slate-500">Choose when you receive updates on trips and validations.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Push Notifications for Boarding Status</p>
                <p className="text-slate-500">Receive instant alerts when bus departs or boarding opens.</p>
              </div>
              <button
                type="button"
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  pushEnabled ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {pushEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Email Booking & Invoice Receipts</p>
                <p className="text-slate-500">Receive tax invoice receipts and payment confirmations.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  emailAlerts ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {emailAlerts ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-bold text-slate-900">Validation Audio Chimes</p>
                <p className="text-slate-500">Play high-pitch acoustic beep on successful QR scans.</p>
              </div>
              <button
                type="button"
                onClick={() => setAudioChime(!audioChime)}
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  audioChime ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {audioChime ? "Audio On" : "Muted"}
              </button>
            </div>
          </div>
        </div>

        {/* Localization & Display */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Regional & Display Options</h2>
              <p className="text-xs text-slate-500">Configure currency formatting and dashboard theme.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="currency-select" className="font-bold text-slate-700">Display Currency</label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-blue-500 font-semibold"
              >
                <option value="NLe (Leone)">Sierra Leone Leone (NLe)</option>
                <option value="USD ($)">United States Dollar (USD $)</option>
                <option value="EUR (€)">Euro (EUR €)</option>
                <option value="GBP (£)">British Pound (GBP £)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="theme-select" className="font-bold text-slate-700">Theme Preference</label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-blue-500 font-semibold"
              >
                <option value="System Default">Adaptive System Default</option>
                <option value="Light Mode">Light Theme (Clean White)</option>
                <option value="Dark High Contrast">Dark High Contrast</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} loading={saving} className="bg-blue-600 hover:bg-blue-500">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
