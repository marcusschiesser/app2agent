import { isExtension } from "./env";
import html2canvas from "html2canvas";

export const DEBUG_SCREENSHOTS = false;

export type Screenshot = {
  mimeType: string;
  data: string;
};

/**
 * Opens a new window to display a screenshot for debugging purposes
 */
function displayScreenshotDebug(screenshot: Screenshot) {
  const debugWindow = window.open(
    "",
    "Screenshot Debug",
    "width=800,height=600",
  );
  if (!debugWindow) {
    console.error("Failed to open debug window");
    return;
  }

  debugWindow.document.write(`
    <html>
      <head>
        <title>Screenshot Debug</title>
        <style>
          body { margin: 0; background: #1e1e1e; color: white; font-family: system-ui; }
          .debug-info { padding: 1rem; background: #2d2d2d; }
          img { max-width: 100%; height: auto; display: block; margin: 1rem auto; }
        </style>
      </head>
      <body>
        <div class="debug-info">
          <h3>Screenshot Debug Info</h3>
          <p>Mime Type: ${screenshot.mimeType}</p>
          <p>Data Length: ${screenshot.data.length} characters</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <p>Environment: ${isExtension ? "Extension" : "Browser"}</p>
        </div>
        <img src="data:${screenshot.mimeType};base64,${screenshot.data}" alt="Debug Screenshot" />
      </body>
    </html>
  `);
}

/**
 * Takes a screenshot of the visible viewport using HTML5 Canvas API
 */
async function takeViewportScreenshot(): Promise<Screenshot> {
  // Create a canvas element
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to get canvas context");
  }

  // Set canvas dimensions to viewport size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Create a temporary HTML element to hold the page content
  const html = document.documentElement;

  try {
    // Convert the viewport to a data URL
    const blob = await html2canvas(html, {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
    const dataUrl = blob.toDataURL("image/jpeg");
    const [, data] = dataUrl.split(",");
    return { mimeType: "image/jpeg", data };
  } catch (error) {
    throw new Error(
      `Failed to capture viewport: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

async function takeExtensionScreenshot(): Promise<Screenshot> {
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

        const [, data] = response.dataUrl.split(",");
        resolve({ mimeType: "image/jpeg", data });
      },
    );
  });
}

/**
 * Takes a screenshot of the current page.
 * In extension mode: captures the entire visible tab using chrome APIs
 * In non-extension mode: captures the visible viewport using HTML5 Canvas
 * @returns Promise<Screenshot> - The screenshot data and mime type
 */
export async function takeScreenshot(): Promise<Screenshot | undefined> {
  try {
    const screenshot = await (isExtension
      ? takeExtensionScreenshot()
      : takeViewportScreenshot());

    if (DEBUG_SCREENSHOTS) {
      displayScreenshotDebug(screenshot);
    }

    return screenshot;
  } catch (error) {
    console.error("Failed to take screenshot", error);
  }
}
