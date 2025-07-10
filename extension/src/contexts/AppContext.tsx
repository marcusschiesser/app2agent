/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ReactNode, createContext, useContext, useMemo } from "react";
import { SiteConfig } from "../hooks/use-config";
import { useLiveAPI, UseLiveAPIResults } from "../hooks/use-live-api";
import { useTools } from "./ToolsContext";
import { BaseTool, LiveConnectConfig, ModalityType } from "llamaindex";

type AppContextValue = {
  liveAPI: UseLiveAPIResults | null;
  siteConfig: SiteConfig;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export type AppProviderProps = {
  children: ReactNode;
  url?: string;
  config: SiteConfig;
};

export function AppProvider({ children, config }: AppProviderProps) {
  const { context, apiKey, prompt } = config;
  const toolManager = useTools();

  // Replace 'context' variable with the desired resolved value
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const systemInstructions = useMemo(() => {
    const resolvedPrompt = prompt.replace(/{{context}}/g, context);
    return resolvedPrompt;
  }, [prompt, context]);

  const liveConfig = useMemo<LiveConnectConfig>(
    () => ({
      tools: toolManager.getTools() as BaseTool[],
      responseModality: [ModalityType.AUDIO],
      systemInstruction: systemInstructions,
    }),
    [toolManager, systemInstructions],
  );

  const api = useLiveAPI({ apiKey, config: liveConfig });

  const contextValue: AppContextValue = {
    liveAPI: api,
    siteConfig: config,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
