"use client";

import { useState } from "react";
import { CodeSnippet } from "./CodeSnippet";
import { ApiKeyDisplay } from "../components/ApiKeyDisplay";
import { ThemeSelector, type Theme } from "../components/ThemeSelector";

export function IntegrationContent({ apiKey }: { apiKey: string | null }) {
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);
  const [theme, setTheme] = useState<Theme>("support");

  return (
    <>
      <ThemeSelector theme={theme} onThemeChange={setTheme} />
      <CodeSnippet apiKey={currentApiKey} theme={theme} />
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
