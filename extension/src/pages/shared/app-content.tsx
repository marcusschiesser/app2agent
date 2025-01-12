import React from "react";
import { Recorder } from "@/components/recorder";
import { useConfig } from "@/hooks/use-config";
import { Loading } from "@/components/loading";
import { Header } from "@/components/header";
import { ToolsProvider } from "@/contexts/ToolsContext";
import { AppProvider } from "@/contexts/AppContext";
import { ToolCall } from "@/components/tool-call";

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

interface AppContentProps {
  onClose: () => void;
}

export function AppContent({ onClose }: AppContentProps) {
  const config = useConfig();

  if (config.isLoading) {
    return <LoadingConfig />;
  }

  const hasSetup = config.manual && config.apiKey;

  if (!hasSetup) {
    return <NoConfig />;
  }

  return (
    <ToolsProvider>
      <AppProvider config={config} url={uri}>
        <div className="w-[200px]">
          <Recorder onFinished={onClose} />
          <ToolCall />
        </div>
      </AppProvider>
    </ToolsProvider>
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
