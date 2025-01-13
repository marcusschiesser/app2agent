import { handleTabScreenshot } from "./recorder-controller";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "TAKE_SCREENSHOT":
      handleTabScreenshot(sender, sendResponse);
      return true;
  }

  return false;
});

if (chrome.sidePanel) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
} else {
  chrome.action.onClicked.addListener(async (tab) => {
    // Empty listener to enable activeTab permission
    if (!tab.id) return; // Empty listener to enable activeTab permission
    await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDER" });
  });
}
