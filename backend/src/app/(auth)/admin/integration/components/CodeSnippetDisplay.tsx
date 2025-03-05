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

interface CodeSnippetDisplayProps {
  codeContent: string;
  isLoading?: boolean;
  tooltipText?: string;
  tooltipCopiedText?: string;
  className?: string;
  preClassName?: string;
  disabled?: boolean;
  onCopy?: () => string;
}

export function CodeSnippetDisplay({
  codeContent,
  isLoading = false,
  tooltipText = "Copy",
  tooltipCopiedText = "Copied!",
  className = "group relative",
  preClassName = "rounded-lg bg-muted p-4 text-sm font-mono text-muted-foreground",
  disabled = false,
  onCopy,
}: CodeSnippetDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!isLoading) {
      // Use the custom copy function if provided, otherwise use the displayed content
      const contentToCopy = onCopy ? onCopy() : codeContent;
      if (contentToCopy) {
        navigator.clipboard.writeText(contentToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }
    }
  };

  return (
    <div className={className}>
      <pre className={preClassName}>
        <code>{isLoading ? "Loading..." : codeContent}</code>
      </pre>
      <div className="absolute right-2 top-2">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading || disabled || !codeContent}
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{copied ? tooltipCopiedText : tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
