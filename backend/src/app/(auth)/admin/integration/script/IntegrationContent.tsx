"use client";

import { useState } from "react";
import { CodeSnippet } from "./CodeSnippet";
import { ApiKeyDisplay } from "../extension/ApiKeyDisplay";

export function IntegrationContent({ apiKey }: { apiKey: string | null }) {
  const [currentApiKey, setCurrentApiKey] = useState(apiKey);

  return (
    <>
      <CodeSnippet apiKey={currentApiKey} />
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
