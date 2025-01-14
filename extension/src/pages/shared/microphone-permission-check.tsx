import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MicOff } from "lucide-react";

const CHECK_INTERVAL = 1000; // Check every second

export function MicPermissionCheck() {
  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);

  useEffect(() => {
    async function checkPermission() {
      const state = await checkMicrophonePermission();
      console.log("microphone permission state", state);
      if (state === "prompt") {
        await requestPermission();
      }
      setPermissionState(state);
    }

    // Initial check
    checkPermission();

    // Set up periodic checking
    const intervalId = setInterval(checkPermission, CHECK_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array as we want to set up the interval only once

  if (permissionState === "denied") {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <MicOff className="h-4 w-4" />
          <AlertTitle>Microphone Access Denied</AlertTitle>
          <AlertDescription>
            Please enable microphone access in your browser settings to use this
            extension.
          </AlertDescription>
        </Alert>
        <Button
          variant="destructive"
          onClick={() => {
            const extensionId = chrome.runtime.id;
            chrome.tabs.create({
              url: `chrome://settings/content/siteDetails?site=chrome-extension://${extensionId}`,
            });
          }}
          className="w-full"
        >
          Open Settings
        </Button>
      </div>
    );
  }

  return null;
}

async function requestPermission() {
  // sends request permission to the content script
  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const activeTab = tabs[0];

  if (activeTab?.id) {
    await chrome.tabs.sendMessage(activeTab.id, {
      type: "REQUEST_MICROPHONE_PERMISSION",
    });
  }
}

async function checkMicrophonePermission(): Promise<PermissionState> {
  try {
    const result = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return result.state;
  } catch (error) {
    console.error("Error checking microphone permission:", error);
    return "denied";
  }
}
