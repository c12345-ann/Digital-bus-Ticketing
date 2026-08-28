"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailPattern } from "@/lib/validation";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");

    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response=await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
      const payload=await response.json(); if(!response.ok)throw new Error(payload.message);
      setSuccess("If the account exists, a password recovery link has been sent.");
    } catch(c) { setError(c instanceof Error?c.message:"Unable to request password recovery."); }
    finally { setLoading(false); }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={error}
        autoComplete="email"
        required
      />
      <Button type="submit" loading={loading} disabled={!email}>
        Send recovery link
      </Button>
    </form>
  );
}
