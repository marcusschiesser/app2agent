"use client";

import {
  updateSettingsAction,
  fetchSettingsAction,
  type WebApp,
} from "@/app/(auth)/actions/settings";
import { useActionState, useCallback, useEffect, useState } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
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

const MAX_DOCUMENTATION_LENGTH = 4000; // Tested maximum is 50000;

export default function Settings() {
  const [app, setApp] = useState<WebApp>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [driverInstance, setDriverInstance] = useState<Driver | null>(null);
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

  // Function to start the tour at a specific step
  const showTourAtStep = (stepIndex: number) => {
    if (driverInstance) {
      // First highlight the specific element
      driverInstance.highlight({
        element: driverInstance.getConfig().steps?.[stepIndex]
          ?.element as string,
        popover: driverInstance.getConfig().steps?.[stepIndex]?.popover,
      });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "#gemini_key",
            popover: {
              title: "Gemini API Key",
              description: `
                <div class="space-y-2">
                  <p>Enter your <strong>Gemini API key</strong> here. This is required for AI functionality.</p>
                  <p>You can get a key from <a href="https://aistudio.google.com/apikey" target="_blank" class="text-blue-500 hover:underline">Google AI Studio</a>.</p>
                </div>
              `,
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#url",
            popover: {
              title: "Domain",
              description: `
                <div class="space-y-2">
                  <p>Enter the domain of your web application.</p>
                  <p>If you're using an <strong>Outsystems App</strong>, the domain ends with <strong>outsystems.app</strong>.</p>
                  <p>Example: <strong>myapp.outsystems.app</strong></p>
                </div>
              `,
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#prompt",
            popover: {
              title: "Prompt",
              description: `
                <div class="space-y-2">
                  <p>This is the <strong>instruction</strong> for the behavior of your AI agent.</p>
                  <p>Just copy a template or write your own prompt.</p> 
                  <p>If you need more details, you can reference a context document, e.g. a <strong>FAQ</strong> or <strong>documentation</strong> of your app. To reference the context, include the <code>{{context}}</code> placeholder.</p>
                </div>
              `,
              side: "top",
              align: "start",
            },
          },
          {
            element: "#context",
            popover: {
              title: "Context (Optional)",
              description: `
                <div class="space-y-2">
                  <p>This field is <strong>optional</strong>. Paste a context document of your app here, e.g. a <strong>documentation</strong> or <strong>FAQ</strong>.</p>
                  <p>The context can be referenced in your prompt using the <code>{{context}}</code> placeholder.</p>
                  <p>If left empty, your agent will rely solely on the prompt without additional context.</p>
                </div>
              `,
              side: "top",
              align: "start",
            },
          },
        ],
        nextBtnText: "Next",
        prevBtnText: "Previous",
        doneBtnText: "Done",
        onDestroyed: () => {
          // Optional: Add any cleanup or post-tour actions here
        },
      });

      setDriverInstance(driverObj);

      // Uncomment to automatically start the tour when the page loads
      // driverObj.drive();
    }
  }, [isLoading]);

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
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Configure your web application to enhance it with AI agents using
              app2agent. After configuration, continue with the{" "}
              <Link href="/admin/integration" className="underline">
                integration
              </Link>
              .
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => driverInstance?.drive()}
            disabled={isLoading || !driverInstance}
            className="flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Interactive Guide
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form action={clientAction} className="space-y-6">
          <input type="hidden" name="id" value={app?.id || ""} />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="gemini_key">Gemini API Key</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => showTourAtStep(0)}
                disabled={isLoading || !driverInstance}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help for Gemini API Key</span>
              </Button>
            </div>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="url">Domain</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => showTourAtStep(1)}
                disabled={isLoading || !driverInstance}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help for Domain</span>
              </Button>
            </div>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => showTourAtStep(2)}
                disabled={isLoading || !driverInstance}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help for Prompt</span>
              </Button>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="context">Context (Optional)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => showTourAtStep(3)}
                disabled={isLoading || !driverInstance}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help for Context</span>
              </Button>
            </div>
            {isLoading ? (
              <Skeleton className="h-[480px] w-full" />
            ) : (
              <Textarea
                name="context"
                id="context"
                rows={20}
                maxLength={MAX_DOCUMENTATION_LENGTH}
                defaultValue={app?.context || ""}
                placeholder="Optional: Paste documentation or FAQ that will be referenced in your prompt."
              />
            )}
            <p className="text-sm text-muted-foreground">
              This field is optional. If provided, limited to{" "}
              {MAX_DOCUMENTATION_LENGTH.toLocaleString()} characters. Larger
              documentations need{" "}
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
