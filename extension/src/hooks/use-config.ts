import { useEffect, useState } from "react";
import { fetchConfig, SiteConfig } from "@/lib/config";

/**
 * Custom hook to manage config state with the service worker
 * @returns Config state and loading state
 */
export function useConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      setIsLoading(true);
      try {
        // Get initial config from service worker
        chrome.runtime.sendMessage({ type: "GET_CONFIG" }, async (response) => {
          if (!response) {
            // Fetch and store config if not available
            const config = await fetchConfig(getCurrentDomain());
            chrome.runtime.sendMessage(
              { type: "SET_CONFIG", config },
              (updatedConfig) => {
                console.log("[app2agent] Received config:", updatedConfig);
                setConfig(updatedConfig);
              },
            );
          } else {
            console.log("[app2agent] Using cached config:", response);
            setConfig(response);
          }
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadConfig();
  }, []);

  return { config, isLoading };
}

/**
 * TODO: just use the url.hostname (the whole domain)
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
