"use client";

import { useState } from "react";
import { ApiKeyDisplay } from "../extension/ApiKeyDisplay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OutsystemsCodeSnippet } from "./OutsystemsCodeSnippet";

export function OutsystemsIntegrationContent({
  apiKey,
}: {
  apiKey: string | null;
}) {
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);
  const [theme, setTheme] = useState<"support" | "tutor">("support");

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Theme:</p>
        <Select
          value={theme}
          onValueChange={(value) => setTheme(value as "support" | "tutor")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="support">IT-Support</SelectItem>
            <SelectItem value="tutor">AI-Tutor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <OutsystemsCodeSnippet apiKey={currentApiKey} theme={theme} />
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Your API key:</p>
        <ApiKeyDisplay
          apiKey={currentApiKey}
          onApiKeyChange={(newKey) => setCurrentApiKey(newKey)}
        />
      </div>
    </>
  );
}
