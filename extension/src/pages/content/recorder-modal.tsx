import "@/index.css";
import React, { useEffect, useState } from "react";
import { getModalRoot, Modal } from "@/components/modal";
import { Recorder } from "@/components/recorder";
import { AppProvider } from "@/contexts/LiveAPIContext";
import { useConfig } from "@/hooks/use-config";
import { Loading } from "@/components/loading";
import { Header } from "@/components/header";
import { ToolsProvider } from "@/contexts/ToolsContext";

interface ChromeMessage {
  type: "TOGGLE_RECORDER";
}

function RecorderModalApp() {
  const config = useConfig();
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

  const isLoading = config.isLoading;
  const hasSetup = config.manual && config.apiKey;

  return (
    <Modal onClose={handleClose}>
      {isLoading ? (
        <LoadingConfig />
      ) : hasSetup ? (
        <ToolsProvider>
          <AppProvider config={config} url={uri}>
            <Recorder onFinished={handleClose} />
          </AppProvider>
        </ToolsProvider>
      ) : (
        <NoConfig />
      )}
    </Modal>
  );
}

function ConfigWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 w-[200px] h-[180px] space-y-16">
      <Header />
      {children}
    </div>
  );
}

function LoadingConfig() {
  return (
    <ConfigWrapper>
      <Loading text="Loading configuration" />
    </ConfigWrapper>
  );
}

function NoConfig() {
  return (
    <ConfigWrapper>
      <div className="flex flex-col items-center">
        <p className="text-[14px] text-slate-500 text-center">
          No configuration found.
          <br /> Go to{" "}
          <a
            href="https://app2agent.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            app2agent
          </a>{" "}
          to setup
        </p>
      </div>
    </ConfigWrapper>
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
