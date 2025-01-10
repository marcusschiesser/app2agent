/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { LiveConfig } from "../multimodal-live-types";
import { AudioStreamer } from "../lib/audio-streamer";
import { audioContext } from "../lib/audio-context";

interface LiveAPIState {
  connected: boolean;
}

interface LiveAPIMessage {
  type: "LIVE_API_CONNECTION_UPDATE" | "LIVE_API_AUDIO_DATA";
  connected?: boolean;
  data?: ArrayBuffer;
}

export type UseLiveAPIResults = {
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
};

type UseLiveAPIProps = {
  url: string;
  apiKey: string;
  config: LiveConfig;
};

export function useLiveAPI({
  url,
  apiKey,
  config,
}: UseLiveAPIProps): UseLiveAPIResults {
  const [state, setState] = useState<LiveAPIState>({
    connected: false,
  });
  const [volume, setVolume] = useState(0);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet<any>("vol-meter", (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // Successfully added worklet
          });
      });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    // Initialize the live API client in the service worker
    chrome.runtime.sendMessage(
      { type: "INITIALIZE_LIVE_API", url, apiKey },
      (response) => {
        setState(response);
      },
    );

    // Listen for state updates from the service worker
    const handleMessage = (message: LiveAPIMessage) => {
      if (
        message.type === "LIVE_API_CONNECTION_UPDATE" &&
        message.connected !== undefined
      ) {
        setState((prev) => ({ ...prev, connected: message.connected! }));
      } else if (message.type === "LIVE_API_AUDIO_DATA" && message.data) {
        audioStreamerRef.current?.addPCM16(new Uint8Array(message.data));
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Get initial state
    chrome.runtime.sendMessage({ type: "GET_LIVE_API_STATE" }, (response) => {
      setState(response);
    });

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [url, apiKey]);

  const connect = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "CONNECT_LIVE_API", config },
        (response) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            setState(response);
            resolve();
          }
        },
      );
    });
  }, [config]);

  const disconnect = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "DISCONNECT_LIVE_API" },
        (response) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            setState(response);
            resolve();
          }
        },
      );
    });
  }, []);

  return {
    connected: state.connected,
    connect,
    disconnect,
    volume,
  };
}
