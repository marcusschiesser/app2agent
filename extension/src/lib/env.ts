/**
 * Whether we're running in a browser extension environment
 */
export const isExtension = typeof chrome !== "undefined" && chrome.runtime;

/**
 * Get the inject script element
 * @returns The inject script element or null if not found
 */
export function getInjectScript(): HTMLScriptElement | null {
  if (document.currentScript) {
    return document.currentScript as HTMLScriptElement;
  }

  const scripts = Array.from(document.getElementsByTagName("script"));
  return scripts.find((script) => script.src.includes("inject.js")) ?? null;
}

/**
 * Get URL for a resource in both browser extension and non-extension environments
 * @param path - The path to the resource
 * @returns The full URL to the resource
 */
export function getURL(path: string): string {
  // Check if we're in a Chrome extension environment
  if (isExtension) {
    return chrome.runtime.getURL(path);
  }

  // Fallback for non-extension environment
  const injectScript = getInjectScript();
  if (!injectScript) {
    throw new Error("Could not find inject.js script tag");
  }
  return injectScript.src.replace("inject.js", path);
}

export async function getActiveUrl(): Promise<string> {
  // Check if we're in the sidepanel
  if (isExtension && chrome.sidePanel) {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab.url || "";
  } else {
    return window.location.href;
  }
}
