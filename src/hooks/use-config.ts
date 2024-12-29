import { useEffect, useState } from "react";

const backend = "https://app2agent.com/api";

export function useConfig() {
  const [isLoading, setIsLoading] = useState(false);
  const [manual, setManual] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    async function fetchManual() {
      try {
        setIsLoading(true);
        const rootHostname = getCurrentDomain();
        const response = await fetch(
          `${backend}/manuals?url=${encodeURIComponent(rootHostname)}`,
        );
        const data = (await response.json()) as {
          content: string;
          apiKey: string;
        };
        setManual(data.content);
        setApiKey(data.apiKey);
      } catch (error) {
        console.error("Error fetching manual:", error);
        setManual(""); // Reset to empty string on error
        setApiKey(""); // Reset API key on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchManual();
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
