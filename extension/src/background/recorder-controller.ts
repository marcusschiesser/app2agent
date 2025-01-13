// Handle tab capture
export function handleTabCapture(
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: {
    success: boolean;
    error?: string;
    streamId?: string;
  }) => void,
): void {
  // Get the active tab from the current window, excluding the sidepanel
  chrome.tabs.query(
    { active: true, currentWindow: true, windowType: "normal" },
    async (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        sendResponse({ success: false, error: "No active tab found" });
        return;
      }

      // Check if this is a chrome:// URL
      if (tab.url?.startsWith("chrome://")) {
        sendResponse({
          success: false,
          error: "Chrome system pages cannot be captured",
        });
        return;
      }

      chrome.tabCapture.getMediaStreamId(
        {
          targetTabId: tab.id,
        },
        (streamId) => {
          if (chrome.runtime.lastError) {
            console.error("Capture error:", chrome.runtime.lastError);
            sendResponse({
              success: false,
              error: chrome.runtime.lastError.message,
            });
            return;
          }

          if (!streamId) {
            sendResponse({
              success: false,
              error: "Failed to get stream ID",
            });
            return;
          }

          sendResponse({ success: true, streamId: streamId });
        },
      );
    },
  );
}

// Handle tab screenshot capture
export function handleTabScreenshot(
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: {
    success: boolean;
    error?: string;
    dataUrl?: string;
  }) => void,
): void {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.id) {
      sendResponse({ success: false, error: "No active tab found" });
      return;
    }

    chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "jpeg", quality: 80 },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Screenshot error:", chrome.runtime.lastError);
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
          return;
        }

        if (!dataUrl) {
          sendResponse({
            success: false,
            error: "Failed to capture screenshot",
          });
          return;
        }

        // Remove the data URL prefix
        const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
        sendResponse({ success: true, dataUrl: base64Data });
      },
    );
  });
}
