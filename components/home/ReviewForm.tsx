"use client";

import { useState } from "react";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), role: role.trim(), message: message.trim(), rating })
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Failed to submit your review.");
      return;
    }

    setSubmitted(true);
    setName("");
    setRole("");
    setMessage("");
    setRating(5);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-3xl">🎉</p>
        <h3 className="mt-2 font-heading text-lg font-bold text-primary-dark">Thank you!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Your review has been submitted and will appear on the site after admin approval.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Submit another review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8"
    >
      <h3 className="font-heading text-lg font-bold text-primary-dark">Share Your Experience</h3>
      <p className="mt-1 text-sm text-gray-500">
        Let others know what you think about our courses and teachers.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Your Name *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. Abdur Rahim"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Role / Location
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. Parent, Dhaka"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold text-gray-600">Rating *</label>
        <div className="flex gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              className={star <= rating ? "text-gold" : "text-gray-300"}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold text-gray-600">Your Review *</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          placeholder="Tell us about your experience..."
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
