import { useEffect, useState, useRef } from "react";
import { AudioRecorder } from "@/lib/audio-recorder";
import { CallForm } from "./call-form";
import { Feedback } from "./feedback";
import { audioContext } from "@/lib/audio-context";
import { createDialingTone } from "@/lib/dialing-tone";
import { playConnectedTone } from "@/lib/connected-tone";
import { useAppContext } from "@/contexts/AppContext";
import { takeScreenshot } from "@/lib/screenshot";
import { Alert, AlertDescription } from "./ui/alert";
import { XCircle } from "lucide-react";
export interface RecorderProps {
  onFinished?: () => void;
  onCallActiveChange?: (isActive: boolean) => void;
}

export function Recorder({ onFinished, onCallActiveChange }: RecorderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { liveAPI } = useAppContext();
  const connected = liveAPI?.connected ?? false;
  const client = liveAPI?.client;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted] = useState(false);
  const [inVolume, setInVolume] = useState(0);
  const dialingToneRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const onData = (base64: string) => {
      if (client && connected) {
        client.sendRealtimeInput([
          {
            mimeType: "audio/pcm;rate=16000",
            data: base64,
          },
        ]);
      }
    };

    if (connected && !muted && isEnabled) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
    }

    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, muted, isEnabled, audioRecorder]);

  useEffect(() => {
    if (!client) return;

    const handleError = (errorMessage: string) => {
      setError(errorMessage);
      setIsEnabled(false);
      onCallActiveChange?.(false);
    };

    client.on("error", handleError);

    return () => {
      client.off("error", handleError);
    };
  }, [client, onCallActiveChange]);

  useEffect(() => {
    if (isEnabled && !connected) {
      // Start dialing tone when attempting to connect
      audioContext({ id: "audio-out" }).then((ctx) => {
        dialingToneRef.current = createDialingTone(ctx);
      });
    } else if (dialingToneRef.current) {
      // Stop dialing tone when connected or disabled
      dialingToneRef.current.stop();
      dialingToneRef.current = null;

      // Play connected tone if we're still enabled
      if (isEnabled && connected) {
        audioContext({ id: "audio-out" }).then((ctx) => {
          playConnectedTone(ctx);
        });
      }
    }
  }, [isEnabled, connected]);

  const handleToggleEnabled = async (checked: boolean) => {
    if (!liveAPI) {
      setError("LiveAPI is not ready");
      return;
    }
    setError(null);

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

  useEffect(() => {
    let timeoutId = -1;

    async function sendVideoFrame() {
      if (!client) {
        return;
      }

      const screenshot = await takeScreenshot();
      client.sendRealtimeInput([screenshot]);

      if (connected) {
        timeoutId = window.setTimeout(sendVideoFrame, 1000 / 0.5);
      }
    }

    if (connected) {
      requestAnimationFrame(sendVideoFrame);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [connected, client]);

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <CallForm
        isEnabled={isEnabled}
        onToggle={handleToggleEnabled}
        volume={inVolume}
      />

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
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}
