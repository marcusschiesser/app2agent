// Request audio permissions
export async function requestAudioPermissions(): Promise<boolean> {
  try {
    const audio = new Audio();
    audio.src =
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    await audio.play();
    return true;
  } catch (error) {
    console.error("Failed to get audio permissions:", error);
    return false;
  }
}

// Handle tab capture
export function handleTabCapture(
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: {
    success: boolean;
    error?: string;
    streamId?: string;
  }) => void,
): void {
  if (!sender.tab?.id) {
    sendResponse({ success: false, error: "No tab ID found" });
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab.id) {
      sendResponse({ success: false, error: "No active tab found" });
      return;
    }

    chrome.tabCapture.getMediaStreamId(
      {
        targetTabId: tab.id,
        consumerTabId: sender.tab!.id,
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
  });
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
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab.id) {
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
