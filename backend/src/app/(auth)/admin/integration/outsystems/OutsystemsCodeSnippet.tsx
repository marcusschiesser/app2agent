"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBaseUrl } from "@/lib/url";

export function OutsystemsCodeSnippet({
  apiKey,
  theme,
}: {
  apiKey: string | null;
  theme: "support" | "tutor";
}) {
  const [copied, setCopied] = useState(false);
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
        let scriptContent = await response.text();
        scriptContent = scriptContent.trimStart();

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

  const previewCharLimit = 5000; // Number of characters to show in preview
  const scriptPreview = injectScript
    ? injectScript.substring(0, previewCharLimit)
    : "Loading script...";

  return (
    <div className="group relative w-full max-w-full">
      <pre className="rounded-lg bg-muted p-4 text-sm font-mono text-muted-foreground overflow-auto max-h-[400px] overflow-x-auto whitespace-pre-wrap break-all max-w-full">
        <code>{loading ? "Loading script..." : scriptPreview}</code>
      </pre>
      <div className="absolute right-2 top-2">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={loading || !injectScript}
                onClick={() => {
                  if (injectScript) {
                    // The script already includes the variables, just copy it directly
                    navigator.clipboard.writeText(injectScript);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1000);
                  }
                }}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{copied ? "Copied!" : "Copy"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
