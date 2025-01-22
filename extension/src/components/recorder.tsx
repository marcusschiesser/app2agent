import { useEffect, useState, useRef, useCallback } from "react";
import { AudioRecorder } from "@/lib/audio-recorder";
import { CallForm } from "./call-form";
import { Feedback } from "./feedback";
import { audioContext } from "@/lib/audio-context";
import { createDialingTone } from "@/lib/dialing-tone";
import { playConnectedTone } from "@/lib/connected-tone";
import { useAppContext } from "@/contexts/AppContext";
import { takeScreenshot, takeScreenshotAsText } from "@/lib/screenshot";
import { useConfig } from "@/hooks/use-config";

export interface RecorderProps {
  onFinished?: () => void;
  onCallActiveChange?: (isActive: boolean) => void;
}

export function Recorder({ onFinished, onCallActiveChange }: RecorderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { liveAPI } = useAppContext();
  const connected = liveAPI?.connected ?? false;
  const client = liveAPI?.client;
  const { manual } = useConfig();

  // const audioRef = useRef<HTMLAudioElement>(null);
  // const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted] = useState(false);
  const [inVolume, setInVolume] = useState(0);
  const dialingToneRef = useRef<{ stop: () => void } | null>(null);

  const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Listen for URL changes from the service worker
    const handleUrlChange = (message: any) => {
      if (message.type === "URL_CHANGED") {
        setCurrentUrl(message.url);
      }
    };

    chrome.runtime.onMessage.addListener(handleUrlChange);
    return () => {
      chrome.runtime.onMessage.removeListener(handleUrlChange);
    };
  }, []);

  // useEffect(() => {
  //   const onData = (base64: string) => {
  //     if (client && connected) {
  //       client.sendRealtimeInput([
  //         {
  //           mimeType: "audio/pcm;rate=16000",
  //           data: base64,
  //         },
  //       ]);
  //     }
  //   };

  //   if (connected && !muted && isEnabled) {
  //     audioRecorder.on("data", onData).on("volume", setInVolume).start();
  //   } else {
  //     audioRecorder.stop();
  //   }

  //   return () => {
  //     audioRecorder.off("data", onData).off("volume", setInVolume);
  //   };
  // }, [connected, client, muted, isEnabled, audioRecorder]);

  // useEffect(() => {
  //   if (isEnabled && !connected) {
  //     // Start dialing tone when attempting to connect
  //     audioContext({ id: "audio-out" }).then((ctx) => {
  //       dialingToneRef.current = createDialingTone(ctx);
  //     });
  //   } else if (dialingToneRef.current) {
  //     // Stop dialing tone when connected or disabled
  //     dialingToneRef.current.stop();
  //     dialingToneRef.current = null;

  //     // Play connected tone if we're still enabled
  //     if (isEnabled && connected) {
  //       audioContext({ id: "audio-out" }).then((ctx) => {
  //         playConnectedTone(ctx);
  //       });
  //     }
  //   }
  // }, [isEnabled, connected]);

  const handleToggleEnabled = async (checked: boolean) => {
    if (!liveAPI) {
      console.error("LiveAPI is not ready");
      return;
    }

    if (checked) {
      setIsEnabled(true);
      onCallActiveChange?.(true);
      liveAPI.connect();
    } else {
      setIsEnabled(false);
      setShowFeedback(true);
      onCallActiveChange?.(false);
      liveAPI.disconnect();
    }
  };

  const sendVideoFrame = useCallback(async () => {
    if (!client || !connected) {
      return;
    }

    const markdown = await takeScreenshotAsText();
    console.log("Sending screenshot", markdown);
    client.sendMessage(
      `Here is the current screenshot of the web app that I am using in markdown format:\n\n<screenshot>${markdown}</screenshot>\n\n\n. Here's more information about the web app:\n###\n${manual.slice(0, 10000)}\n###\n. Use all this information to help me answer my questions. Don't respond to this message.`,
    );
  }, [client, connected, manual]);

  // useEffect(() => {
  //   let timeoutId = -1;

  //   // Send initial frame
  //   if (connected) {
  //     requestAnimationFrame(sendVideoFrame);
  //   }

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [connected, client, sendVideoFrame]);

  useEffect(() => {
    if (currentUrl && connected && client) {
      sendVideoFrame();
    }
  }, [currentUrl, connected, client, sendVideoFrame]);

  return (
    <div>
      <CallForm
        isEnabled={isEnabled}
        onToggle={handleToggleEnabled}
        volume={inVolume}
      />

      <div className="mt-2 text-sm">
        Connection status: {connected ? "Connected" : "Disconnected"}
        URL: {currentUrl}
      </div>

      {showFeedback && !isEnabled && (
        <Feedback
          onSubmit={(rating) => {
            console.log("Call feedback:", rating);
            setShowFeedback(false);
            if (onFinished) {
              onFinished();
            }
          }}
        />
      )}
      {/* <audio ref={audioRef} style={{ display: "none" }} /> */}
    </div>
  );
}
