import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MicOff } from "lucide-react";
import { isExtension } from "@/lib/env";

const CHECK_INTERVAL = 1000; // Check every second

export const MicPermissionCheck = () => {
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
            {isExtension ? (
              <>
                Please enable microphone access in your browser settings to use
                this extension.
              </>
            ) : (
              <>
                Please enable microphone access for this website. Look for the
                info icon in your browser's address bar and click it to manage
                permissions.
              </>
            )}
          </AlertDescription>
        </Alert>
        {isExtension && (
          <Button
            variant="destructive"
            onClick={async () => {
              const extensionId = chrome.runtime.id;
              await chrome.tabs.create({
                url: `chrome://settings/content/siteDetails?site=chrome-extension://${extensionId}`,
              });
            }}
            className="w-full"
          >
            Open Settings
          </Button>
        )}
      </div>
    );
  }

  return null;
};

async function requestPermission() {
  if (typeof chrome === "undefined" || !chrome.runtime) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop all tracks to release the microphone
      stream.getTracks().forEach((track) => track.stop());
      return;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      return;
    }
  }

  // Extension environment: sends request permission to the content script
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
