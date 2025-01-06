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
  const tools = useTools();

  // Get tool configurations
  const toolConfigs = tools.getTools();
  const toolsPrompt = tools.getPrompt();

  // Create config with tools and prompts
  const liveConfig: LiveConfig = {
    model: "models/gemini-2.0-flash-exp",
    systemInstruction: {
      parts: [
        {
          text: "You're IT support. If the user connects, welcome him/her with a suitable greeting.",
        },
        {
          text: `Use the following context if helpful:\n###\n${manual}\n###\n`,
        },
        {
          text: `You can use the following tools to help you with your task:\n${toolsPrompt}\n`,
        },
        {
          text: `Tool use policies:
1. If you need to perform a tool call, don't need to say: i'll do something - just do it.
2. It's important to evaluate the current state of the website through the screenshot and the tool call result to know what is the current status of the request.
3. Don't make a tool call if the previous result is successful or the tool call was not doing anything.
4. Once a tool is completed, tell the user the status of the request. Don't try to call a tool again with the same request or the result showed that the tool call was stopped by the user.`,
        },
      ],
    },
    tools: toolConfigs,
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

// Helper function to check if site is configured
export const isSiteConfigured = (config: SiteConfig) =>
  Boolean(config.apiKey && config.manual);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
