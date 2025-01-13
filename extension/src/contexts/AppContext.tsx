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
import { SiteConfig } from "@/lib/config";
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
          text: `Your task is to help the user with his requests. Analyze the request first and use your tools if they are helpful to reach the user's goal. Don't be verbose or ask for information for other actions which are not in your capabilities.`,
        },
        {
          text: `You can use the following tools to help you with your task:\n${toolsPrompt}\n`,
        },
        {
          text: `Tool use policies:
1. To resolve user request, perform only a single call to a tool with the user's request.
2. Once the tool call is completed, check the response in the result and do not try to make the same request again and update the status to the user.`,
        },
        {
          text: `Use the following context if helpful:\n###\n${manual}\n###\n`,
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
