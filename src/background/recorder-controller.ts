// Send the toggle message when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDER" });
});

// Handle tab capture requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TAB_STREAM") {
    if (!sender.tab?.id) {
      sendResponse({ success: false, error: "No tab ID found" });
      return true;
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

          sendResponse({
            success: true,
            streamId: streamId,
          });
        },
      );
    });

    return true; // Will respond asynchronously
  }
});
