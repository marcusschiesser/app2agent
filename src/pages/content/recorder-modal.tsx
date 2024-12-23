declare const __GEMINI_API_KEY__: any;

import "@/index.css";
import React, { useEffect, useState } from "react";
import { getModalRoot, Modal } from "@/components/modal";
import { Recorder } from "@/components/recorder";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";

function RecorderModalApp() {
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

  return (
    <Modal onClose={handleClose}>
      <Recorder onFinished={handleClose} />
    </Modal>
  );
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

// Initialize the modal root
getModalRoot().then((root) => {
  root.render(
    <React.StrictMode>
      <LiveAPIProvider url={uri} apiKey={__GEMINI_API_KEY__}>
        <RecorderModalApp />
      </LiveAPIProvider>
    </React.StrictMode>,
  );
});

console.log("app2agent loaded");
