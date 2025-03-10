import { handleTabCapture, handleTabScreenshot } from "./recorder-controller";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "GET_TAB_STREAM":
      handleTabCapture(sender, sendResponse);
      return true;

    case "TAKE_SCREENSHOT":
      handleTabScreenshot(sender, sendResponse);
      return true;

    case "TOGGLE_PAGE_ICON":
      // Forward the message to toggle the recorder in the active tab
      if (sender.tab && sender.tab.id) {
        chrome.tabs.sendMessage(sender.tab.id, { type: "TOGGLE_RECORDER" });
      }
      return true;

    case "CHECK_PERMISSION":
      if (sender.tab && sender.tab.url) {
        const url = new URL(sender.tab.url);
        chrome.storage.local.get(["permittedDomains"], (result) => {
          const permittedDomains = result.permittedDomains || [];
          const hasPermission = permittedDomains.includes(url.hostname);
          sendResponse({ hasPermission });
        });
        return true;
      }
      sendResponse({ hasPermission: false });
      return true;
  }

  return false;
});

// Send the toggle message when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url) return;

  const url = new URL(tab.url);

  // Store the domain as permitted when the extension icon is clicked
  chrome.storage.local.get(["permittedDomains"], (result) => {
    const permittedDomains = result.permittedDomains || [];
    if (!permittedDomains.includes(url.hostname)) {
      permittedDomains.push(url.hostname);
      chrome.storage.local.set({ permittedDomains }, () => {
        // Notify the content script that permissions have been updated
        chrome.tabs.sendMessage(tab.id!, { type: "PERMISSION_UPDATED" });
      });
    }
  });

  await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDER" });
});
