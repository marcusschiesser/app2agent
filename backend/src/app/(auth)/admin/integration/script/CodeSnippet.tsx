"use client";

import { getBaseUrl } from "@/lib/url";
import { type Theme } from "../components/ThemeSelector";
import { CodeSnippetDisplay } from "../components/CodeSnippetDisplay";

export function CodeSnippet({
  apiKey,
  theme,
}: {
  apiKey: string | null;
  theme: Theme;
}) {
  const domain = getBaseUrl();
  const snippet = `<script src="${domain}/extension/inject/inject.js"
  data-api-key="${apiKey}"
  data-theme="${theme}"
></script>`;

  return (
    <CodeSnippetDisplay
      codeContent={snippet}
      tooltipText="Copy snippet to clipboard"
    />
  );
}
