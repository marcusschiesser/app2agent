import { useEffect, useState } from "react";

const backend = "https://app2agent.com/api";

export function useManualLookup() {
  const [manual, setManual] = useState<string>("");

  useEffect(() => {
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          try {
            console.log("Fetching manual for:", url.hostname);
            const response = await fetch(
              `${backend}/manuals?url=${encodeURIComponent(url.hostname)}`,
            );
            if (!response.ok) {
              throw new Error("Failed to fetch manual");
            }
            const data = await response.json();
            setManual(data.content);
          } catch (error) {
            console.error("Error fetching manual:", error);
            setManual(""); // Reset to empty string on error
          }
        }
      });
    }
  }, []);

  return manual;
}
