import { handleTabCapture, handleTabScreenshot } from "./recorder-controller";
import { getConfig, setConfig } from "../lib/config";
import {
  connectClient,
  disconnectClient,
  getLiveAPIState,
  initializeClient,
} from "./live-api";

// Keep track of recorder visibility state
let isRecorderVisible = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "GET_TAB_STREAM":
      handleTabCapture(sender, sendResponse);
      return true;

    case "TAKE_SCREENSHOT":
      handleTabScreenshot(sender, sendResponse);
      return true;

    case "GET_RECORDER_VISIBILITY":
      sendResponse({ isVisible: isRecorderVisible });
      return true;

    case "GET_CONFIG":
      sendResponse(getConfig());
      return true;

    case "SET_CONFIG":
      setConfig(message.config);
      sendResponse(getConfig());
      return true;

    case "INITIALIZE_LIVE_API":
      initializeClient(message.url, message.apiKey);
      sendResponse(getLiveAPIState());
      return true;

    case "CONNECT_LIVE_API":
      connectClient(message.config)
        .then(() => sendResponse(getLiveAPIState()))
        .catch((error) => sendResponse({ error: error.message }));
      return true;

    case "DISCONNECT_LIVE_API":
      disconnectClient()
        .then(() => sendResponse(getLiveAPIState()))
        .catch((error) => sendResponse({ error: error.message }));
      return true;

    case "GET_LIVE_API_STATE":
      sendResponse(getLiveAPIState());
      return true;
  }

  return false;
});

// Send the toggle message when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  isRecorderVisible = !isRecorderVisible;
  await chrome.tabs.sendMessage(tab.id, {
    type: "RECORDER_VISIBILITY_CHANGED",
    isVisible: isRecorderVisible,
  });
});
