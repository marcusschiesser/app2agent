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

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.action.onClicked.addListener(async (tab) => {
  // Empty listener to enable activeTab permission
});
