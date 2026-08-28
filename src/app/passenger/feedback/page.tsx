"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2, ThumbsUp } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast-provider";
import type { UserFeedback } from "@/types";
import { Button } from "@/components/ui/button";

export default function PassengerFeedbackPage() {
  const store = useAppStore();
  const toast = useToast();

  const [route, setRoute] = useState(store.routes[0]?.origin + " to " + store.routes[0]?.destination);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<"Punctuality" | "Cleanliness" | "Staff Behavior" | "Booking Ease" | "Other">("Punctuality");
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Feedback Missing", "Please write a few words about your journey experience.");
      return;
    }

    store.submitFeedback({
      passengerName: "Aminata Kamara",
      passengerEmail: "passenger@example.com",
      route,
      rating,
      category,
      comment,
    });

    setIsSubmitted(true);
    setComment("");
    toast.success("Feedback Received", "Thank you! Your feedback helps us improve transit operations.");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Trip Feedback & Ratings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Share your experience with our buses, punctuality, and conductors to improve service quality.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Feedback Submission Form */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Submit Journey Review
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="feedback-route" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Route Traveled
              </label>
              <select
                id="feedback-route"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              >
                {store.routes.map((r) => (
                  <option key={r.id} value={`${r.origin} to ${r.destination}`}>
                    {r.origin} → {r.destination}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition hover:scale-110"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="feedback-category" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Category
              </label>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as UserFeedback["category"])}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              >
                <option value="Punctuality">Bus Punctuality & Timing</option>
                <option value="Cleanliness">Bus Cleanliness & AC</option>
                <option value="Staff Behavior">Conductor & Staff Courtesy</option>
                <option value="Booking Ease">QR Ticketing & Booking App</option>
                <option value="Other">General Feedback</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="feedback-comment" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Your Comments & Suggestions
              </label>
              <textarea
                id="feedback-comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your boarding, seating, and arrival experience?"
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            <Button type="submit" className="w-full inline-flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              Submit Feedback
            </Button>
          </form>
        </div>

        {/* Recent Community Feedback stream */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-emerald-600" />
            Recent Passenger Reviews
          </h2>

          <div className="space-y-3">
            {store.feedbackList.map((fb) => (
              <div
                key={fb.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{fb.passengerName}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-blue-600">{fb.route} • {fb.category}</p>
                <p className="text-slate-600 leading-relaxed italic">
                  &ldquo;{fb.comment}&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{fb.date}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-3 w-3" />
                    {fb.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
