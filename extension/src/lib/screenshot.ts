import TurndownService from "turndown";

/**
 * Requests a screenshot from the background service.
 * @returns Promise<string> - The screenshot as base64 data
 */
export async function takeScreenshot(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "TAKE_SCREENSHOT" },
      (response: { success: boolean; error?: string; dataUrl?: string }) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response.success || !response.dataUrl) {
          reject(new Error(response.error || "Failed to capture screenshot"));
          return;
        }

        resolve(response.dataUrl);
      },
    );
  });
}

/**
 * Captures the current tab's HTML content and converts it to markdown.
 * @returns Promise<string> - The page content as markdown
 */
export async function takeScreenshotAsText(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "GET_TAB_HTML" },
      (response: { success: boolean; error?: string; html?: string }) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response.success || !response.html) {
          reject(new Error(response.error || "Failed to capture HTML content"));
          return;
        }

        // Configure TurndownService to exclude scripts and other unwanted elements
        const turndownService = new TurndownService({
          headingStyle: "atx",
          codeBlockStyle: "fenced",
        });

        // Remove script tags and their contents
        turndownService.remove(["script", "style", "noscript"]);

        const markdown = turndownService.turndown(response.html);
        resolve(markdown);
      },
    );
  });
}
