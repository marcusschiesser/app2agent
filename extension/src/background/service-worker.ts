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
  }
});

// Send the toggle message when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDER" });
});
