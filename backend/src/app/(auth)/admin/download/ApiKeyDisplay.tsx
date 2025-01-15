"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { regenerateApiKeyAction } from "@/app/(auth)/actions/settings";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ApiKeyDisplayProps {
  apiKey: string | null;
  manualId: string | null;
}

function maskApiKey(key: string) {
  if (key.length <= 8) return key;
  const visibleChars = 4;
  const firstPart = key.slice(0, visibleChars);
  const lastPart = key.slice(-visibleChars);
  const middlePart = "•".repeat(Math.min(key.length - visibleChars * 2, 8));
  return `${firstPart}${middlePart}${lastPart}`;
}

export function ApiKeyDisplay({
  apiKey: initialApiKey,
  manualId,
}: ApiKeyDisplayProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerateSuccess, setRegenerateSuccess] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState(initialApiKey);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [regenerateState, regenerateAction] = useActionState(
    regenerateApiKeyAction,
    {},
  );

  useEffect(() => {
    if (!regenerateState.isError && regenerateState.data?.api_key) {
      setCurrentApiKey(regenerateState.data.api_key);
      setRegenerateSuccess(true);
      setTimeout(() => setRegenerateSuccess(false), 1000);
    }
  }, [regenerateState]);

  const handleRegenerateKey = () => {
    if (!manualId) return;
    const form = new FormData();
    form.append("id", manualId);
    startTransition(() => {
      regenerateAction(form);
    });
    setOpen(false);
  };

  const displayValue = currentApiKey
    ? showApiKey
      ? currentApiKey
      : maskApiKey(currentApiKey)
    : "";

  return (
    <div className="group relative mt-2">
      <Input
        type="text"
        value={displayValue}
        readOnly
        className="pr-32 bg-muted text-muted-foreground font-mono"
      />
      <div className="absolute right-0 top-0 hidden h-full items-center gap-1 px-3 group-hover:flex">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (currentApiKey) {
                    navigator.clipboard.writeText(currentApiKey);
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
            <TooltipContent>
              <p>Copy API Key</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowApiKey(!showApiKey)}
        >
          {showApiKey ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        {manualId && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      {regenerateSuccess ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <RefreshCw
                          className={cn("h-4 w-4", isPending && "animate-spin")}
                        />
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Regenerate API Key?</DialogTitle>
                      <DialogDescription>
                        This will invalidate the current API key. All users and
                        extensions using the current key will need to be updated
                        with the new key. Are you sure you want to continue?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRegenerateKey}>Continue</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Regenerate API Key</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
