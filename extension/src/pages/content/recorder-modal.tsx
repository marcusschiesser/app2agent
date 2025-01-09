import "@/index.css";
import React, { useEffect, useState } from "react";
import { getModalRoot, Modal } from "@/components/modal";
import { Recorder } from "@/components/recorder";
import { useConfig } from "@/hooks/use-config";
import { Loading } from "@/components/loading";
import { Header } from "@/components/header";
import { ToolsProvider } from "@/contexts/ToolsContext";
import { AppProvider } from "@/contexts/AppContext";
import { ToolCall } from "@/components/tool-call";

interface ChromeMessage {
  type: "RECORDER_VISIBILITY_CHANGED";
  isVisible: boolean;
}

function RecorderModalApp() {
  const config = useConfig();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get initial visibility state
    chrome.runtime.sendMessage(
      { type: "GET_RECORDER_VISIBILITY" },
      (response) => {
        setIsVisible(response.isVisible);
      },
    );

    // Listen for visibility changes
    const handleMessage = (message: ChromeMessage) => {
      if (message.type === "RECORDER_VISIBILITY_CHANGED") {
        setIsVisible(message.isVisible);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleClose = () => {
    // Send message to service worker to update state
    chrome.runtime.sendMessage({
      type: "RECORDER_VISIBILITY_CHANGED",
      isVisible: false,
    });
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
            <div className="w-[200px]">
              <Recorder onFinished={handleClose} />
              <ToolCall />
            </div>
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
