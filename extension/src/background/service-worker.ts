import { handleGetTabHtml } from "./html-controller";
import { handleTabScreenshot } from "./recorder-controller";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "TAKE_SCREENSHOT":
      handleTabScreenshot(sender, sendResponse);
      return true;
    case "GET_TAB_HTML":
      handleGetTabHtml(sender, sendResponse);
      return true;
  }

  return false;
});

// Listen for URL changes
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("url tab:", tab);
    const message = {
      type: "URL_CHANGED",
      url: tab.url,
    };

    if (chrome.sidePanel) {
      await chrome.runtime.sendMessage(message);
    } else {
      await chrome.tabs.sendMessage(tabId, message);
    }
  }
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
