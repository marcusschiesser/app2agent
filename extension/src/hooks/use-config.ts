import { useEffect, useState, useCallback } from "react";
import { secureFetch } from "@/lib/secure-fetch";
import { getInjectScript } from "@/lib/env";

export enum Mode {
  Support = "support",
  Tutor = "tutor",
}

export type SiteConfig = {
  context: string;
  apiKey: string; // Gemini API key - not the app2agent one
  isLoading: boolean;
  error?: string;
  reload: () => void;
  prompt: string;
  configError?: string;
  mode: Mode;
};

async function getConfig(): Promise<Response> {
  const domain = await getCurrentDomain();
  const response = await secureFetch(
    `/api/config?url=${encodeURIComponent(domain)}`,
  );
  return response;
}

const mode = (getInjectScript()?.getAttribute("data-mode") ??
  Mode.Support) as Mode;

export function useConfig(): SiteConfig {
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [error, setError] = useState<string>();
  const [configError, setConfigError] = useState<string>();
  const [reloadCounter, setReloadCounter] = useState(0);

  const reload = useCallback(() => {
    setReloadCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      try {
        setIsLoading(true);
        setError(undefined);
        setConfigError(undefined);
        setPrompt("");
        setContext("");
        setApiKey("");

        const response = await getConfig();

        if (response.status === 404) {
          setConfigError("No configuration found for this domain");
          return;
        }

        const data = (await response.json()) as {
          context: string;
          apiKey: string;
          prompt: string;
          mode?: string;
        };
        if (!data.context) {
          setConfigError("No context defined for this domain");
          return;
        }
        if (!data.apiKey) {
          setConfigError("No Gemini API key defined for this domain");
          return;
        }
        if (!data.prompt) {
          setConfigError("No prompt defined for this domain");
          return;
        }
        setPrompt(data.prompt);
        setContext(data.context);
        setApiKey(data.apiKey);
      } catch (error) {
        console.error("Error fetching config:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch config",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchConfig();
  }, [reloadCounter]);

  return {
    prompt,
    context,
    apiKey,
    isLoading,
    error,
    reload,
    configError,
    mode,
  };
}

/**
 * Extracts the full domain from the current URL.
 * When called from the sidepanel, gets the URL from the active tab.
 * Eg: current URL is https://www.linkedin.com/feed/ -> returns www.linkedin.com
 * @returns The full domain as a string.
 */
async function getCurrentDomain(): Promise<string> {
  let url: string;

  // Check if we're in the sidepanel
  if (chrome.sidePanel) {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    url = tab.url || "";
  } else {
    url = window.location.href;
  }

  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
}
