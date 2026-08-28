"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type ProfileFormState = {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  nationalId: string;
};

const emptyProfile: ProfileFormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  phone: "",
  nationalId: "",
};

export function ProfileForm() {
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch("/api/auth/profile");
      const payload = await response.json();

      if (response.ok) {
        setForm({
          firstName: payload.user.firstName ?? "",
          middleName: payload.user.middleName ?? "",
          lastName: payload.user.lastName ?? "",
          phone: payload.user.phone ?? "",
          nationalId: payload.user.nationalId ?? "",
        });
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  function updateField(name: keyof ProfileFormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!response.ok) {
      setError("Profile update failed.");
      return;
    }

    setMessage("Profile updated.");
  }

  if (loading) {
    return <LoadingSpinner label="Loading profile" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {message ? <Alert tone="success">{message}</Alert> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            required
          />
          <Input
            label="Middle Name"
            name="middleName"
            value={form.middleName}
            onChange={(event) => updateField("middleName", event.target.value)}
          />
        </div>
        <Input
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={(event) => updateField("lastName", event.target.value)}
          required
        />
        <Input
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <Input
          label="National ID"
          name="nationalId"
          value={form.nationalId}
          onChange={(event) => updateField("nationalId", event.target.value)}
        />
        <Button type="submit" loading={saving}>
          Save profile
        </Button>
      </form>
    </Card>
  );
}
