import { handleTabCapture, handleTabScreenshot } from "./recorder-controller";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "GET_TAB_STREAM":
      handleTabCapture(sender, sendResponse);
      return true;

    case "TAKE_SCREENSHOT":
      handleTabScreenshot(sender, sendResponse);
      return true;
  }

  return false;
});

// Send the toggle message when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDER" });
});
