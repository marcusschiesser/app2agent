import { secureFetch } from "@/lib/secure-fetch";

const backend =
  process.env.NODE_ENV === "development"
    ? // ? "http://localhost:3000/api"
      "https://www.app2agent.com/api"
    : "https://www.app2agent.com/api";

export type SiteConfig = {
  manual: string;
  apiKey: string;
};

// Config state
let config: SiteConfig | null = null;

export function setConfig(newConfig: SiteConfig | null) {
  config = newConfig;
}

export function getConfig(): SiteConfig | null {
  return config;
}

export async function fetchConfig(
  hostname: string,
): Promise<SiteConfig | null> {
  try {
    const response = await secureFetch(
      `${backend}/config?url=${encodeURIComponent(hostname)}`,
    );
    const data = (await response.json()) as {
      content: string;
      apiKey: string;
    };
    return {
      manual: data.content,
      apiKey: data.apiKey,
    };
  } catch (error) {
    console.error("Error fetching config:", error);
    return null;
  }
}
