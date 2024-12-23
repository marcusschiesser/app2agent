"use client";

import { FormEvent, useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [intendedUsage, setIntendedUsage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setStatus("idle");
      setErrorMessage("");

      // Check for gmail addresses
      if (email.toLowerCase().endsWith("@gmail.com")) {
        setStatus("error");
        setErrorMessage(
          "Please use your company email address instead of Gmail",
        );
        return;
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: name || null,
          companyName: companyName || null,
          intendedUsage: intendedUsage || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to sign up");
        return;
      }

      setStatus("success");
      setEmail("");
      setName("");
      setCompanyName("");
      setIntendedUsage("");
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="email-signup" className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Apps?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Join the waitlist for early access and special pricing
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg text-gray-900"
              required
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="px-4 py-3 rounded-lg text-gray-900"
            />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name (optional)"
              className="px-4 py-3 rounded-lg text-gray-900"
            />
            <textarea
              value={intendedUsage}
              onChange={(e) => setIntendedUsage(e.target.value)}
              placeholder="How do you plan to use our solution? (optional)"
              className="px-4 py-3 rounded-lg text-gray-900 min-h-[100px]"
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
            <p className="mt-4 text-red-400">{errorMessage}</p>
          )}
        </form>
      </div>
    </section>
  );
}
