"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { emailPattern, isUserRole } from "@/lib/validation";
import type { UserRole } from "@/types";

type FormErrors = {
  email?: string;
  password?: string;
  role?: string;
  form?: string;
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("passenger");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!isUserRole(role)) {
      nextErrors.role = "Choose a valid role.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors({ form: payload.message ?? "Login failed." });
        return;
      }

      router.push(payload.redirectTo);
      router.refresh();
    } catch {
      setErrors({ form: "Unable to login right now." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      {errors.form ? <Alert tone="error">{errors.form}</Alert> : null}
      <div className="grid gap-2">
        <label htmlFor="role" className="text-sm font-semibold text-slate-700">
          Account Type <span className="text-orange-600">*</span>
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        >
          <option value="passenger">Passenger</option>
          <option value="conductor">Conductor</option>
          <option value="administrator">Administrator</option>
        </select>
        {errors.role ? (
          <p className="text-sm font-medium text-red-600">{errors.role}</p>
        ) : null}
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errors.email}
        autoComplete="email"
        required
      />
      <PasswordInput
        label="Password"
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.password}
        autoComplete="current-password"
        required
      />
      <Button type="submit" loading={loading} disabled={!email || !password}>
        Login
      </Button>
    </form>
  );
}
