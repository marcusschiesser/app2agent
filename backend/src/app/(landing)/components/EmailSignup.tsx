"use client";

import { signUpAction } from "@/app/(auth)/actions/auth";
import { useActionState } from "react";

export default function EmailSignup() {
  const [state, formAction, isPending] = useActionState(signUpAction, {});

  const previousFormData = state.formData as Record<string, string> | undefined;

  if (state.type === "success" && state.message) {
    return (
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="flex flex-col gap-8 w-full text-center">
            <div className="text-5xl font-bold text-blue-100">🎉 Success!</div>
            <div className="text-xl text-blue-100">{state.message}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="email-signup" className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Apps?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Join for early access and special pricing
        </p>
        {state.type === "error" && state.message && (
          <div className="max-w-md mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{state.message}</p>
          </div>
        )}
        <form action={formAction} className="max-w-md mx-auto">
          <div className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg text-gray-900"
              required
              defaultValue={previousFormData?.email || ""}
            />
            <input
              type="password"
              name="password"
              placeholder="Choose a password"
              className="px-4 py-3 rounded-lg text-gray-900"
              required
              minLength={6}
            />
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="px-4 py-3 rounded-lg text-gray-900"
              required
              defaultValue={previousFormData?.name || ""}
            />
            <input
              type="text"
              name="companyName"
              placeholder="Company name"
              className="px-4 py-3 rounded-lg text-gray-900"
              required
              defaultValue={previousFormData?.companyName || ""}
            />
            <input
              type="text"
              name="intendedUsage"
              placeholder="How do you plan to use our product? (Optional)"
              className="px-4 py-3 rounded-lg text-gray-900"
              defaultValue={previousFormData?.intendedUsage || ""}
            />
            <button
              type="submit"
              disabled={isPending}
              className={`bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Signing up..." : "Join"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
