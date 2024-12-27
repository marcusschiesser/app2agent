"use client";

import { AuthState, authAction } from "@/app/actions";
import { useActionState, useState } from "react";

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  let initialState: AuthState = {};

  if (typeof window !== "undefined") {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const error = params.get("error");
      const error_description = params.get("error_description");

      if (error && error_description) {
        initialState = {
          type: "error",
          message: decodeURIComponent(error_description),
        };
      }
    }
  }

  const [state, formAction, isPending] = useActionState(
    authAction,
    initialState,
  );

  if (state.type === "success" && state.message) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <div className="flex flex-col gap-8 w-full max-w-xl text-center">
          <div className="text-6xl font-bold text-indigo-600">🎉 Success!</div>
          <div className="text-2xl text-gray-600">{state.message}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp
            ? "Join us to transform your enterprise web apps"
            : "Sign in to app2agent"}
        </p>
      </div>
      {state.type === "error" && state.message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{state.message}</p>
        </div>
      )}
      <div className="w-full max-w-md mx-auto p-6">
        <form
          className="space-y-4"
          action={(formdata) => {
            formdata.append("type", isSignUp ? "signUp" : "signIn");
            formAction(formdata);
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSignUp
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
          >
            {isSignUp && <span>➕</span>}
            {!isSignUp && <span>➡️</span>}
            {isPending ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp((prev) => !prev)}
            className={`w-full text-sm ${
              isSignUp
                ? "text-indigo-600 hover:text-indigo-500"
                : "text-green-600 hover:text-green-500"
            }`}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </button>
        </form>
      </div>
    </>
  );
}
