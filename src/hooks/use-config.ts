import { useEffect, useState } from "react";
import { secureFetch } from "@/lib/secure-fetch";

const backend = "https://app2agent.com/api";

export type UserConfig = {
  manual: string;
  apiKey: string;
  isLoading: boolean;
};

export function useConfig() {
  const [isLoading, setIsLoading] = useState(false);
  const [manual, setManual] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        setIsLoading(true);
        const rootHostname = getCurrentDomain();
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
 * Eg: current URL is https://www.linkedin.com/feed/ -> returns linkedin.com
 * @returns The root domain as a string.
 */
function getCurrentDomain() {
  const parsedUrl = new URL(window.location.href);
  const hostname = parsedUrl.hostname;
  const parts = hostname.split(".");
  const rootHostname = parts.slice(-2).join(".");
  return rootHostname;
}
