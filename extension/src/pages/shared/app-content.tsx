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
      <ConfigWrapper>
        <Settings
          onSaved={() => {
            config.reload();
          }}
        />
      </ConfigWrapper>
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
    <div className="p-4">
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

function ConfigWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 h-[180px] space-y-16">
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
