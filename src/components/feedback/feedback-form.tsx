"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function FeedbackForm() {
  const [category, setCategory] = useState("Route experience");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (message.trim().length < 10) {
      setError("Feedback must be at least 10 characters.");
      return;
    }

    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    setSuccess("Feedback submitted.");
    setMessage("");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {success ? <Alert tone="success">{success}</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <div className="grid gap-2">
        <label htmlFor="category" className="text-sm font-semibold text-slate-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        >
          <option>Route experience</option>
          <option>Ticket issue</option>
          <option>Payment issue</option>
          <option>Service feedback</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label htmlFor="feedback" className="text-sm font-semibold text-slate-700">
          Feedback
        </label>
        <textarea
          id="feedback"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
      </div>
      <Button type="submit" loading={loading} disabled={!message}>
        Submit feedback
      </Button>
    </form>
  );
}
