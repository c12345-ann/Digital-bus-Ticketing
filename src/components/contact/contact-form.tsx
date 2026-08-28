"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailPattern } from "@/lib/validation";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");

    if (!name.trim() || !emailPattern.test(email) || message.trim().length < 10) {
      setError("Complete all fields with valid contact details.");
      return;
    }

    setError("");
    setLoading(true);
    try { const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,message})});const payload=await response.json();if(!response.ok)throw new Error(payload.message);setSuccess("Message submitted.");setName("");setEmail("");setMessage(""); }
    catch(cause){setError(cause instanceof Error?cause.message:"Unable to submit message.");}
    finally{setLoading(false);}
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Input
        label="Name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-semibold text-slate-700">
          Message <span className="text-orange-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          required
        />
      </div>
      <Button type="submit" loading={loading} disabled={!name || !email || !message}>
        Submit message
      </Button>
    </form>
  );
}
