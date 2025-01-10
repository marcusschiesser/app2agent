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
