"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  emailPattern,
  getPasswordStrength,
  phonePattern,
  validatePassword,
} from "@/lib/validation";

type FormErrors = Record<string, string>;

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  nationalId: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  function updateField(name: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!emailPattern.test(form.email)) nextErrors.email = "Enter a valid email.";
    if (!phonePattern.test(form.phone)) nextErrors.phone = "Enter a valid phone.";

    const passwordError = validatePassword(form.password);
    if (passwordError) nextErrors.password = passwordError;

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    setSuccess("");

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors({ form: payload.message ?? "Registration failed." });
        return;
      }

      setSuccess("Passenger account created.");
      router.push(payload.redirectTo);
      router.refresh();
    } catch {
      setErrors({ form: "Unable to register right now." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      {errors.form ? <Alert tone="error">{errors.form}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          error={errors.firstName}
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
        error={errors.lastName}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={(event) => updateField("email", event.target.value)}
        error={errors.email}
        autoComplete="email"
        required
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={(event) => updateField("phone", event.target.value)}
        error={errors.phone}
        autoComplete="tel"
        required
      />
      <Input
        label="National ID"
        name="nationalId"
        value={form.nationalId}
        onChange={(event) => updateField("nationalId", event.target.value)}
      />
      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={(event) => updateField("password", event.target.value)}
        error={errors.password}
        autoComplete="new-password"
        required
      />
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width: `${(passwordStrength / 5) * 100}%` }}
        />
      </div>
      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={(event) => updateField("confirmPassword", event.target.value)}
        error={errors.confirmPassword}
        autoComplete="new-password"
        required
      />
      <Button
        type="submit"
        loading={loading}
        disabled={!form.firstName || !form.lastName || !form.email || !form.phone}
      >
        Create passenger account
      </Button>
    </form>
  );
}
