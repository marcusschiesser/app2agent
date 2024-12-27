import { createActionPlan } from "./dom-selector";
import {
  handleTabCapture,
  requestAudioPermissions,
} from "./recorder-controller";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "REQUEST_AUDIO_PERMISSIONS":
      requestAudioPermissions().then((success) => {
        sendResponse({ success });
      });
      return true;

    case "GET_TAB_STREAM":
      handleTabCapture(sender, sendResponse);
      return true;

    case "A2A_GET_ACTION_PLAN":
      createActionPlan(message.dom, message.actionDescription)
        .then((plan) => sendResponse({ success: true, result: plan }))
        .catch((error) =>
          sendResponse({ success: false, result: error.message }),
        );
      return true;

    case "A2A_EXECUTE_PLAN":
      if (!sender.tab?.id) {
        sendResponse({ success: false, error: "No tab ID found" });
        return true;
      }

      chrome.tabs
        .sendMessage(sender.tab.id, message)
        .then((response) => sendResponse(response))
        .catch((error) =>
          sendResponse({ success: false, error: error.message }),
        );
      return true;
  }
});

// Send the toggle message when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDER" });
});
