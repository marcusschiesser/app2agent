import { createActionPlan } from "./dom-selector";
import { createNavigationPlan } from "./planner";
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

    // Event for generating a navigation plan for a user's request
    case "A2A_CREATE_NAVIGATION_PLAN":
      if (!message.apiKey) {
        sendResponse({ success: false, result: "API key is required" });
        return true;
      }
      if (!message.manual) {
        sendResponse({ success: false, result: "Site context is required" });
        return true;
      }
      createNavigationPlan(
        message.userRequest,
        message.currentUrl,
        message.screenshot,
        message.previousExecution,
        message.apiKey,
        message.manual,
      )
        .then((plan) => sendResponse({ success: true, result: plan }))
        .catch((error) =>
          sendResponse({ success: false, result: error.message }),
        );
      return true;

    // Event for getting a dom selector for a specific action
    case "A2A_GET_DOM_SELECTOR":
      if (!message.apiKey) {
        sendResponse({ success: false, result: "API key is required" });
        return true;
      }
      createActionPlan(message.dom, message.actionDescription, message.apiKey)
        .then((plan) => sendResponse({ success: true, result: plan }))
        .catch((error) =>
          sendResponse({ success: false, result: error.message }),
        );
      return true;

    // Event for executing an action
    case "A2A_EXECUTE_ACTION":
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
