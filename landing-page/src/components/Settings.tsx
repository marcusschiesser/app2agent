"use client";

import { updateSettingsAction } from "@/app/actions/settings";
import { useActionState, useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type UserManual = {
  id: string;
  gemini_key: string;
  url: string;
  content: string;
  user_id: string;
};

export default function Settings({ userId }: { userId: string }) {
  const [manual, setManual] = useState<UserManual>();
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    {},
  );

  const fetchManual = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_manuals")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId);
    if (data?.[0]) {
      setManual(data[0]); // TODO: A user can have multiple manuals, but we only want to show the first one for now
    }
  }, [userId]);

  useEffect(() => {
    if (!state.isError) {
      fetchManual();
    }
  }, [fetchManual, state]);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <div className="mt-6">
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="id" value={manual?.id || ""} />
            <div>
              <label
                htmlFor="gemini_key"
                className="block text-sm font-medium text-gray-700"
              >
                Gemini API Key
              </label>
              <input
                type="password"
                name="gemini_key"
                id="gemini_key"
                defaultValue={manual?.gemini_key || ""}
                className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your Gemini API Key"
              />
              <p className="mt-1 text-sm text-gray-500">
                Get your API key from{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  className="text-indigo-600 hover:text-indigo-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://aistudio.google.com/apikey
                </a>
              </p>
            </div>

            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                Root Domain
              </label>
              <input
                type="text"
                name="url"
                id="url"
                defaultValue={manual?.url || ""}
                onBlur={(e) => {
                  // extract domain from URL when user leaves the input field
                  const domain = extractDomain(e.target.value);
                  e.target.value = domain;
                }}
                className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., myapp.com"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Documentation
              </label>
              <textarea
                name="content"
                id="content"
                rows={4}
                defaultValue={manual?.content || ""}
                className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your documentation in Markdown format"
              />
            </div>

            <button
              disabled={isPending}
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save Settings"}
            </button>

            {state.isError && (
              <p className="mt-1 text-sm text-red-500">{state.message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function extractDomain(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const parts = hostname.split(".");
    const rootHostname = parts.slice(-2).join(".");
    return rootHostname;
  } catch {
    return url;
  }
}
