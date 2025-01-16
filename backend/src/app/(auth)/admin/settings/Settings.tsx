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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function Settings() {
  const [app, setApp] = useState<WebApp>();
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    {},
  );

  const fetchApp = useCallback(async () => {
    const { data } = await fetchSettingsAction();
    if (data) {
      setApp(data);
    }
  }, []);

  useEffect(() => {
    fetchApp();
  }, [fetchApp]);

  const clientAction = async (formData: FormData) => {
    const newApp = {
      ...app,
      gemini_key: formData.get("gemini_key")?.toString() || "",
      url: formData.get("url")?.toString() || "",
      content: formData.get("content")?.toString() || "",
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
          <Link href="/admin/download" className="underline">
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
            <Input
              type="password"
              name="gemini_key"
              id="gemini_key"
              defaultValue={app?.gemini_key || ""}
              placeholder="Enter your Gemini API Key"
            />
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
            <p className="text-sm text-muted-foreground">
              Specify the domain of your web application. You can just paste an
              URL which will be converted to a domain.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Documentation</Label>
            <Textarea
              name="content"
              id="content"
              rows={20}
              maxLength={4000}
              defaultValue={app?.content || ""}
              placeholder="The documentation of your web application. You can directly paste the documentation here."
            />
            <p className="text-sm text-muted-foreground">
              Limited to one page. Larger documentations need{" "}
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

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Settings"}
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
