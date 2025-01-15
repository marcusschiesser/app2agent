import React, { useState } from "react";
import { Recorder } from "@/components/recorder";
import { useConfig } from "@/hooks/use-config";
import { Loading } from "@/components/loading";
import { Header } from "@/components/header";
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

  if (config.isLoading) {
    return <LoadingConfig />;
  }

  // After config is loaded, check if we need to show settings
  const needsSetup = !config.manual || !localStorage.getItem("apiKey");
  if (needsSetup) {
    return (
      <div>
        <Header />
        <Settings
          onSaved={() => {
            config.reload();
          }}
        />
      </div>
    );
  }

  // If we have valid setup or user saved settings, show the main content
  return (
    <ToolsProvider>
      <AppProvider config={config} url={uri}>
        <div className="relative">
          <Header
            onSettingsClick={() => !isCallActive && setShowSettings(true)}
            onBackClick={() => setShowSettings(false)}
            showBackButton={showSettings}
            disableSettings={isCallActive}
          />
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
        </div>
      </AppProvider>
    </ToolsProvider>
  );
}

function ConfigWrapper({ children }: { children: React.ReactNode }) {
  return <div className="h-[180px] space-y-16">{children}</div>;
}

function LoadingConfig() {
  return (
    <ConfigWrapper>
      <Loading text="Loading configuration" />
    </ConfigWrapper>
  );
}
