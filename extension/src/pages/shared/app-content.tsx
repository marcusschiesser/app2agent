import React, { useState, useEffect } from "react";
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
import { Alert } from "@/components/ui/alert";
import { getBaseUrl } from "@/lib/secure-fetch";

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

interface AppContentProps {
  onClose: () => void;
  apiKey?: string;
}

export function AppContent({ onClose, apiKey }: AppContentProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const config = useConfig();

  // Use provided API key if available, otherwise check localStorage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("apiKey", apiKey);
    } else if (__API_KEY__) {
      localStorage.setItem("apiKey", __API_KEY__);
    }
  }, [apiKey]);

  const needsSetup = !apiKey && !__API_KEY__ && !localStorage.getItem("apiKey");

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

  if (config.error) {
    return (
      <LayoutWrapper>
        <Alert variant="destructive" className="m-4">
          {config.error}
        </Alert>
      </LayoutWrapper>
    );
  }

  if (config.configError) {
    return <NoConfig reason={config.configError} />;
  }

  // If we have valid setup or user saved settings, show the main content
  return (
    <div className="p-4 space-y-10">
      <ToolsProvider>
        <AppProvider config={config} url={uri}>
          <div className="relative">
            {!apiKey && (
              <MenuButton
                disableSettings={isCallActive}
                onSettingsChange={setShowSettings}
              />
            )}
            <div className="flex justify-center">
              <Header />
            </div>
          </div>
          {!apiKey && showSettings && (
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
              <Recorder onCallActiveChange={setIsCallActive} />
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

function NoConfig({ reason }: { reason: string }) {
  return (
    <LayoutWrapper>
      <div className="flex flex-col items-center">
        <p className="text-[14px] text-slate-500 text-center">
          {reason}
          <br /> Go to{" "}
          <a
            href={`${getBaseUrl()}/admin`}
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
