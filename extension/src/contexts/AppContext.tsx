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

import { ReactNode, createContext, useContext } from "react";
import { SiteConfig } from "../hooks/use-config";
import { useLiveAPI, UseLiveAPIResults } from "../hooks/use-live-api";
import { LiveConfig } from "@/multimodal-live-types";
import { useTools } from "./ToolsContext";

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

export function AppProvider({ url, children, config }: AppProviderProps) {
  const { manual, apiKey } = config;
  const toolManager = useTools();

  // Create config with tools and prompts
  const liveConfig: LiveConfig = {
    model: "models/gemini-2.0-flash-exp",
    systemInstruction: {
      parts: [
        {
          text: "You're IT support. If the user connects, welcome him/her with a suitable greeting. Your task is to help the user with his requests. Analyze the request first and then decide what to do next. Don't be verbose or ask for information for other actions which are not in your capabilities.",
        },
        {
          text: `Use the following context if helpful:\n###\n${manual}\n###\n`,
        },
        ...toolManager.getPrompt(),
      ],
    },
    tools: toolManager.getTools(),
  };

  const api = useLiveAPI({ url, apiKey, config: liveConfig });

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
