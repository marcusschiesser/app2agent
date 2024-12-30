declare const __GEMINI_API_KEY__: any;

import "@/index.css";
import React, { useEffect, useState } from "react";
import { getModalRoot, Modal } from "@/components/modal";
import { Recorder } from "@/components/recorder";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import { useConfig } from "@/hooks/use-config";
import { Loader2 } from "lucide-react";

function RecorderModalApp() {
  const config = useConfig();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "TOGGLE_RECORDER") {
        setIsVisible((prev) => !prev);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const isLoading = config.isLoading;
  const hasSetup = config.manual && config.apiKey;

  return (
    <Modal onClose={handleClose}>
      {isLoading ? (
        <div className="p-4 min-w-[200px] h-[180px] flex flex-col justify-center items-center gap-2">
          <Loader2 className="animate-spin size-10" />
          <div className="text-slate-500">Loading configuration...</div>
        </div>
      ) : hasSetup ? (
        <LiveAPIProvider config={config} url={uri}>
          <Recorder onFinished={handleClose} />
        </LiveAPIProvider>
      ) : (
        <div className="p-4 min-w-[200px] h-[180px] flex flex-col justify-center items-center gap-2">
          <div className="text-slate-500">No manual or API key found</div>
        </div>
      )}
    </Modal>
  );
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

// Initialize the modal root
getModalRoot().then((root) => {
  root.render(
    <React.StrictMode>
      <RecorderModalApp />
    </React.StrictMode>,
  );
});

console.log("app2agent loaded");
