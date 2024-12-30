"use client";

import { updateSettingsAction } from "@/app/actions/settings";
import { useActionState, useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
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

type UserManual = {
  id: string;
  gemini_key: string;
  url: string;
  content: string;
  user_id: string;
};

export default function Settings({ userId }: { userId: string }) {
  const [manual, setManual] = useState<UserManual>();
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    {},
  );

  const fetchManual = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_manuals")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId);
    if (data?.[0]) {
      setManual(data[0]); // TODO: A user can have multiple manuals, but we only want to show the first one for now
    }
  }, [userId]);

  useEffect(() => {
    if (!state.isError) {
      fetchManual();
    }
  }, [fetchManual, state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>
          Configure your application settings here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={manual?.id || ""} />

          <div className="space-y-2">
            <Label htmlFor="gemini_key">Gemini API Key</Label>
            <Input
              type="password"
              name="gemini_key"
              id="gemini_key"
              defaultValue={manual?.gemini_key || ""}
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
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Root Domain</Label>
            <Input
              type="text"
              name="url"
              id="url"
              defaultValue={manual?.url || ""}
              onBlur={(e) => {
                const domain = extractDomain(e.target.value);
                e.target.value = domain;
              }}
              placeholder="e.g., myapp.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Documentation</Label>
            <Textarea
              name="content"
              id="content"
              rows={20}
              defaultValue={manual?.content || ""}
              placeholder="Enter your documentation in Markdown format"
            />
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
    const hostname = parsedUrl.hostname;
    const parts = hostname.split(".");
    const rootHostname = parts.slice(-2).join(".");
    return rootHostname;
  } catch {
    return url;
  }
}
