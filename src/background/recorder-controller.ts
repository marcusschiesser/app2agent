// Request audio permissions
async function requestAudioPermissions(): Promise<boolean> {
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

// Initialize side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Add action listener to grant activeTab permission
chrome.action.onClicked.addListener(async (tab) => {
  // Empty listener to enable activeTab permission
});

// Handle tab capture requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "REQUEST_AUDIO_PERMISSIONS") {
    requestAudioPermissions().then((success) => {
      sendResponse({ success });
    });
    return true;
  }

  if (request.type === "GET_TAB_STREAM") {
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

            sendResponse({
              success: true,
              streamId: streamId,
            });
          },
        );
      },
    );

    return true; // Will respond asynchronously
  }
});
