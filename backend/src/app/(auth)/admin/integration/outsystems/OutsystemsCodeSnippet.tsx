"use client";

import { useState, useEffect } from "react";
import { getBaseUrl } from "@/lib/url";
import { type Theme } from "../components/ThemeSelector";
import { CodeSnippetDisplay } from "../components/CodeSnippetDisplay";

export function OutsystemsCodeSnippet({
  apiKey,
  theme,
}: {
  apiKey: string | null;
  theme: Theme;
}) {
  const [injectScript, setInjectScript] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const domain = getBaseUrl();

  // Fetch the actual inject.js script on component mount
  useEffect(() => {
    async function fetchInjectScript() {
      try {
        setLoading(true);
        const response = await fetch(`${domain}/extension/inject/inject.js`);
        if (!response.ok) {
          throw new Error(`Failed to fetch script: ${response.status}`);
        }
        // Get script content and trim leading spaces
        const scriptContent = await response.text();
        // Prepend the API key and theme variables directly to the script
        const completeScript = `// Set the API key and theme as global variables
window.APP2AGENT_API_KEY = "${apiKey}";
window.APP2AGENT_THEME = "${theme}";
${scriptContent}`;

        setInjectScript(completeScript);
      } catch (error) {
        console.error("Error fetching inject script:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInjectScript();
  }, [domain, apiKey, theme]);

  const previewCharLimit = 1000; // Number of characters to show in preview
  const scriptPreview = injectScript
    ? injectScript.substring(0, previewCharLimit)
    : "Loading script...";

  // When using the CodeSnippetDisplay, we want to copy the full script, not just the preview
  const handleCopy = () => {
    return injectScript || "";
  };

  return (
    <CodeSnippetDisplay
      codeContent={scriptPreview}
      isLoading={loading}
      disabled={!injectScript}
      className="group relative w-full max-w-full"
      preClassName="rounded-lg bg-muted p-4 text-sm font-mono text-muted-foreground whitespace-pre-wrap break-all max-w-full"
      tooltipText="Copy script to clipboard"
      onCopy={handleCopy}
    />
  );
}
