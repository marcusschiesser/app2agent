"use client";

import {
  updateSettingsAction,
  fetchSettingsAction,
  type WebApp,
} from "@/app/(auth)/actions/settings";
import { useActionState, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROMPT_TEMPLATES } from "@/config/promptDefaults";

const MAX_DOCUMENTATION_LENGTH = 50000;

export default function Settings() {
  const [app, setApp] = useState<WebApp>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    {},
  );

  const fetchApp = useCallback(async () => {
    setIsLoading(true);
    const { data } = await fetchSettingsAction();
    if (data) {
      setApp(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchApp();
  }, [fetchApp]);

  const clientAction = async (formData: FormData) => {
    const newApp = {
      ...app,
      gemini_key: formData.get("gemini_key")?.toString() || "",
      url: formData.get("url")?.toString() || "",
      context: formData.get("context")?.toString() || "",
      prompt: formData.get("prompt")?.toString() || "",
    };
    setApp(newApp as WebApp);
    await formAction(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>
          Configure your web application to enhance it with AI agents using
          app2agent. After configuration, continue with the{" "}
          <Link href="/admin/integration" className="underline">
            integration
          </Link>
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-6">
          <input type="hidden" name="id" value={app?.id || ""} />

          <div className="space-y-2">
            <Label htmlFor="gemini_key">Gemini API Key</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                type="password"
                name="gemini_key"
                id="gemini_key"
                defaultValue={app?.gemini_key || ""}
                placeholder="Enter your Gemini API Key"
              />
            )}
            <p className="text-sm text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://aistudio.google.com/apikey"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://aistudio.google.com/apikey
              </a>
              . Adding this key will be removed in the near future.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Domain</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                type="text"
                name="url"
                id="url"
                defaultValue={app?.url || ""}
                onBlur={(e) => {
                  const domain = extractDomain(e.target.value);
                  e.target.value = domain;
                }}
                placeholder="e.g., myapp.com"
              />
            )}
            <p className="text-sm text-muted-foreground">
              Specify the domain of your web application. You can just paste an
              URL which will be converted to a domain.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="prompt">Prompt</Label>
              {!isLoading && (
                <Select
                  value={selectedPrompt}
                  onValueChange={(value) => {
                    setSelectedPrompt(value);
                    const template = PROMPT_TEMPLATES.find(
                      (t) => t.id === value,
                    );
                    if (template) {
                      const textarea = document.getElementById(
                        "prompt",
                      ) as HTMLTextAreaElement;
                      if (textarea) {
                        textarea.value = template.content;
                      }
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px] h-8 text-sm">
                    <SelectValue placeholder="Copy a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PROMPT_TEMPLATES.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-[144px] w-full" />
            ) : (
              <>
                <Textarea
                  name="prompt"
                  id="prompt"
                  rows={6}
                  defaultValue={app?.prompt ?? ""}
                  onChange={() => {
                    // Clear selected template when user manually edits the prompt
                    setSelectedPrompt("");
                  }}
                  placeholder="Enter your prompt or use a template above."
                />
                <p className="text-sm text-muted-foreground">
                  The prompt must contain{" "}
                  <code>
                    {"{{"}
                    context{"}}"}
                  </code>{" "}
                  to reference the context.
                </p>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Context</Label>
            {isLoading ? (
              <Skeleton className="h-[480px] w-full" />
            ) : (
              <Textarea
                name="context"
                id="context"
                rows={20}
                maxLength={MAX_DOCUMENTATION_LENGTH}
                defaultValue={app?.context || ""}
                placeholder="The context referenced in your prompt. You can directly paste the context here."
              />
            )}
            <p className="text-sm text-muted-foreground">
              Limited to {MAX_DOCUMENTATION_LENGTH.toLocaleString()} characters.
              Larger documentations need{" "}
              <a
                href="https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                RAG (Retrieval Augmented Generation)
              </a>{" "}
              configured, please directly contact{" "}
              <a
                href="https://www.linkedin.com/in/marcusschiesser/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Marcus Schiesser
              </a>
              .
            </p>
          </div>

          <Button type="submit" disabled={isPending || isLoading}>
            {isPending
              ? "Saving..."
              : isLoading
                ? "Loading..."
                : "Save Settings"}
          </Button>

          {state.isError && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function extractDomain(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch {
    return url;
  }
}
