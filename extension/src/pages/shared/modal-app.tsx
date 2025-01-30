import "@/index.css";
import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { AppContent } from "../shared/app-content";

interface ChromeMessage {
  type: "TOGGLE_RECORDER";
}

interface ModalAppProps {
  apiKey?: string;
}

export function ModalApp({ apiKey }: ModalAppProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.runtime) {
      const handleMessage = (message: ChromeMessage) => {
        if (message.type === "TOGGLE_RECORDER") {
          setIsVisible((prev) => !prev);
        }
      };

      chrome.runtime.onMessage.addListener(handleMessage);
      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    } else {
      // show per default if not running in a chrome extension
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="w-[200px]">
        <AppContent onClose={handleClose} apiKey={apiKey} />
      </div>
    </Modal>
  );
}
