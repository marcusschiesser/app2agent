/**
 * Whether we're running in a browser extension environment
 */
export const isExtension = typeof chrome !== "undefined" && chrome.runtime;

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
  const scripts = Array.from(document.getElementsByTagName("script"));
  const injectScript = scripts.find((script) =>
    script.src.includes("inject.js"),
  );
  if (!injectScript) {
    throw new Error("Could not find inject.js script tag");
  }
  return injectScript.src.replace("inject.js", path);
}
