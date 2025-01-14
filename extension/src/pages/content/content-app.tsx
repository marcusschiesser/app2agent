import "@/index.css";
import React, { useEffect, useState } from "react";
import { getModalRoot, Modal } from "@/components/modal";
import { AppContent } from "../shared/app-content";

interface ChromeMessage {
  type: "TOGGLE_RECORDER";
}

function ContentScriptApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMessage = (message: ChromeMessage) => {
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
      <div className="w-[200px]">
        <AppContent onClose={handleClose} />
      </div>
    </Modal>
  );
}

// Initialize the modal root
getModalRoot().then((root) => {
  root.render(
    <React.StrictMode>
      <ContentScriptApp />
    </React.StrictMode>,
  );
});

console.log("app2agent loaded");
