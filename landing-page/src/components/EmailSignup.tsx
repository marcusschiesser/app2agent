"use client";

import { FormEvent, useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setStatus("idle");
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
    }
  };

  return (
    <section id="email-signup" className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Support?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Join the waitlist for early access and special pricing
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-full text-gray-900"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-bold transition-colors"
            >
              Join Waitlist
            </button>
          </div>
          {status === "success" && (
            <p className="mt-4 text-green-400">
              Thanks for signing up! We&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-red-400">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
