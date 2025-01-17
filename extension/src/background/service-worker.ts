import { handleTabScreenshot } from "./recorder-controller";
import {
  initializeSpeechRecognition,
  transcribeAudio,
  cleanupSpeechRecognition,
} from "./speech-recognition-controller";

// Initialize speech recognition when the service worker starts
initializeSpeechRecognition((status, data) => {
  // Broadcast status updates to all connected clients
  chrome.runtime
    .sendMessage({
      type: "SPEECH_RECOGNITION_STATUS",
      status,
      data,
    })
    .catch(() => {
      // Ignore errors when no clients are connected
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "TAKE_SCREENSHOT":
      handleTabScreenshot(sender, sendResponse);
      return true;

    case "TRANSCRIBE_AUDIO":
      if (!message.audioData || !message.language) {
        sendResponse({
          success: false,
          error: "Missing audio data or language",
        });
        return false;
      }
      try {
        transcribeAudio(message.audioData, message.language);
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
      return false;
  }

  return false;
});

if (chrome.sidePanel) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
} else {
  chrome.action.onClicked.addListener(async (tab) => {
    // Empty listener to enable activeTab permission
    if (!tab.id) return;
    await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDER" });
  });
}

// Cleanup when the service worker is about to be terminated
chrome.runtime.onSuspend.addListener(() => {
  cleanupSpeechRecognition();
});
