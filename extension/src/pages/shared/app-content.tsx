import React, { useState } from "react";
import { Recorder } from "@/components/recorder";
import { useConfig } from "@/hooks/use-config";
import { Loading } from "@/components/loading";
import { Header } from "@/components/header";
import { MenuButton } from "@/components/menu-button";
import { ToolsProvider } from "@/contexts/ToolsContext";
import { AppProvider } from "@/contexts/AppContext";
import { ToolCall } from "@/components/tool-call";
import { MicPermissionCheck } from "./microphone-permission-check";
import { Settings } from "@/components/settings";

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

interface AppContentProps {
  onClose: () => void;
}

export function AppContent({ onClose }: AppContentProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const config = useConfig();

  const needsSetup = !localStorage.getItem("apiKey");
  if (needsSetup) {
    return (
      <LayoutWrapper>
        <Settings
          onSaved={() => {
            config.reload();
          }}
        />
      </LayoutWrapper>
    );
  }

  if (config.isLoading) {
    return <LoadingConfig />;
  }

  const hasSetup = config.manual && config.apiKey;

  if (!hasSetup) {
    return <NoConfig />;
  }

  // If we have valid setup or user saved settings, show the main content
  return (
    <div className="p-4 space-y-10">
      <ToolsProvider>
        <AppProvider config={config} url={uri}>
          <div className="relative">
            <MenuButton
              disableSettings={isCallActive}
              onSettingsChange={setShowSettings}
            />
            <div className="flex justify-center">
              <Header />
            </div>
          </div>
          {showSettings && (
            <Settings
              onSaved={() => {
                setShowSettings(false);
                config.reload();
              }}
            />
          )}
          {!showSettings && (
            <>
              <MicPermissionCheck />
              <Recorder
                onFinished={onClose}
                onCallActiveChange={setIsCallActive}
              />
              <ToolCall />
            </>
          )}
        </AppProvider>
      </ToolsProvider>
    </div>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-10">
      <Header />
      {children}
    </div>
  );
}

function LoadingConfig() {
  return (
    <LayoutWrapper>
      <Loading text="Loading configuration" />
    </LayoutWrapper>
  );
}

function NoConfig() {
  return (
    <LayoutWrapper>
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
    </LayoutWrapper>
  );
}
