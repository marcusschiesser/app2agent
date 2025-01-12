import { useEffect, useState } from "react";
import { secureFetch } from "@/lib/secure-fetch";

const backend =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://www.app2agent.com/api";

export type SiteConfig = {
  manual: string;
  apiKey: string;
  isLoading: boolean;
};

export function useConfig(): SiteConfig {
  const [isLoading, setIsLoading] = useState(false);
  const [manual, setManual] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        setIsLoading(true);
        const rootHostname = await getCurrentDomain();
        const response = await secureFetch(
          `${backend}/config?url=${encodeURIComponent(rootHostname)}`,
        );
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
  }, []);

  return { manual, apiKey, isLoading };
}

/**
 * Extracts the root domain from the current URL.
 * When called from the sidepanel, gets the URL from the active tab.
 * Eg: current URL is https://www.linkedin.com/feed/ -> returns linkedin.com
 * @returns The root domain as a string.
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
  const hostname = parsedUrl.hostname;
  const parts = hostname.split(".");
  const rootHostname = parts.slice(-2).join(".");
  return rootHostname;
}
