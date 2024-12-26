import { createActionPlan } from "./dom-selector";
import { requestAudioPermissions } from "./recorder-controller";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "REQUEST_AUDIO_PERMISSIONS") {
    requestAudioPermissions().then((success) => {
      sendResponse({ success });
    });
    return true;
  }

  if (message.type === "GET_TAB_STREAM") {
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
    return true;
  }

  if (message.type === "A2A_GET_ACTION_PLAN") {
    createActionPlan(message.dom, message.actionDescription)
      .then((plan) => sendResponse({ success: true, result: plan }))
      .catch((error) =>
        sendResponse({ success: false, result: error.message }),
      );
    return true;
  }

  if (message.type === "A2A_EXECUTE_PLAN") {
    if (!sender.tab?.id) {
      sendResponse({ success: false, error: "No tab ID found" });
      return true;
    }

    chrome.tabs
      .sendMessage(sender.tab.id, message)
      .then((response) => sendResponse(response))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Send the toggle message when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDER" });
});
