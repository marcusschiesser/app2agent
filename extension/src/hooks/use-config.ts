import { useEffect, useState, useCallback } from "react";
import { secureFetch } from "@/lib/secure-fetch";

export type SiteConfig = {
  manual: string;
  apiKey: string;
  isLoading: boolean;
  reload: () => void;
};

async function getConfig(): Promise<Response> {
  const domain = await getCurrentDomain();
  const response = await secureFetch(
    `/api/config?url=${encodeURIComponent(domain)}`,
  );
  return response;
}

export function useConfig(): SiteConfig {
  const [isLoading, setIsLoading] = useState(false);
  const [manual, setManual] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [reloadCounter, setReloadCounter] = useState(0);

  const reload = useCallback(() => {
    setReloadCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      try {
        setIsLoading(true);

        const response = await getConfig();
        if (!response.ok) {
          throw new Error("Failed to fetch config");
        }

        const data = (await response.json()) as {
          content: string;
          apiKey: string;
        };
        setManual(data.content);
        setApiKey(data.apiKey);
      } catch (error) {
        console.error("Error fetching config:", error);
        setManual(""); // Reset to empty string on error
        setApiKey(""); // Reset API key on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchConfig();
  }, [reloadCounter]);

  return { manual, apiKey, isLoading, reload };
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
