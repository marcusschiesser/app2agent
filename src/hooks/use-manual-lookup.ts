import { useEffect, useState } from "react";

const backend = "https://app2agent.com/api";

export function useManualLookup() {
  const [manual, setManual] = useState<string>("");

  useEffect(() => {
    async function fetchManual() {
      try {
        const url = new URL(window.location.href);
        const hostname = url.hostname; // eg. linkedin.com
        const response = await fetch(
          `${backend}/manuals?url=${encodeURIComponent(hostname)}`,
        );
        const data = (await response.json()) as { content: string };
        setManual(data.content);
      } catch (error) {
        console.error("Error fetching manual:", error);
        setManual(""); // Reset to empty string on error
      }
    }

    fetchManual();
  }, []);

  return manual;
}
