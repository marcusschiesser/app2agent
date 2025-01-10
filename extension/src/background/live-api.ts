import { MultimodalLiveClient } from "@/lib/multimodal-live-client";
import { LiveConfig } from "@/multimodal-live-types";

let client: MultimodalLiveClient | null = null;
let connected = false;

export function initializeClient(url: string, apiKey: string) {
  if (!client) {
    client = new MultimodalLiveClient({ url, apiKey });
    setupClientListeners();
  }
  return client;
}

function setupClientListeners() {
  if (!client) return;

  const onClose = () => {
    connected = false;
    broadcastConnectionState();
  };

  const onAudio = (data: ArrayBuffer) => {
    // Broadcast audio data to content scripts
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: "LIVE_API_AUDIO_DATA",
            data,
          });
        }
      });
    });
  };

  client.on("close", onClose).on("audio", onAudio);
}

function broadcastConnectionState() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "LIVE_API_CONNECTION_UPDATE",
          connected,
        });
      }
    });
  });
}

export async function connectClient(config: LiveConfig) {
  if (!client || !config) {
    throw new Error("Client or config not initialized");
  }

  client.disconnect();
  await client.connect(config);
  connected = true;
  broadcastConnectionState();
}

export async function disconnectClient() {
  if (!client) return;

  client.disconnect();
  connected = false;
  broadcastConnectionState();
}

export function getLiveAPIState() {
  return {
    connected,
  };
}
