"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBaseUrl } from "@/lib/url";

export function CodeSnippet({ apiKey }: { apiKey: string | null }) {
  const [copied, setCopied] = useState(false);
  const domain = getBaseUrl();
  const snippet = `<script src="${domain}/extension/inject/inject.js"
  data-api-key="${apiKey}"
></script>`;

  return (
    <div className="group relative">
      <pre className="rounded-lg bg-muted p-4 text-sm font-mono text-muted-foreground">
        <code>{snippet}</code>
      </pre>
      <div className="absolute right-2 top-2">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  navigator.clipboard.writeText(snippet);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
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
              <p>{copied ? "Copied!" : "Copy snippet to clipboard"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
