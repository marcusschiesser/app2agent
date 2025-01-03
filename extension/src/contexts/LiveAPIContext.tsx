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

import { createContext, FC, ReactNode, useContext } from "react";
import { UserConfig } from "../hooks/use-config";
import { useLiveAPI, UseLiveAPIResults } from "../hooks/use-live-api";
import { LiveConfig } from "@/multimodal-live-types";
import { toolManager } from "@/lib/tools/manager";
import { siteConfig } from "@/lib/site-config";

type LiveAPIContextValue = {
  liveAPI: UseLiveAPIResults | null;
};

const LiveAPIContext = createContext<LiveAPIContextValue | undefined>(
  undefined,
);

export type LiveAPIProviderProps = {
  children: ReactNode;
  url?: string;
};

export const LiveAPIProvider: FC<
  LiveAPIProviderProps & { config: UserConfig }
> = ({ url, children, config }) => {
  const { manual, apiKey } = config;

  // Set site configuration
  siteConfig.setApiKey(apiKey);
  siteConfig.setSiteContext(manual);

  const api = useLiveAPI({ url, apiKey, config: getConfig(manual) });
  return (
    <LiveAPIContext.Provider value={{ liveAPI: api }}>
      {children}
    </LiveAPIContext.Provider>
  );
};

export const useLiveAPIContext = () => {
  const context = useContext(LiveAPIContext);
  if (!context) {
    throw new Error("useLiveAPIContext must be used within a LiveAPIProvider");
  }
  return context;
};

function getConfig(manual: string): LiveConfig {
  const tools = toolManager.getTools();
  const toolsPrompt = toolManager.getPrompt();
  const systemInstruction = {
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
        text: `When using navigation tool, you don't need to break down the user's request into multiple steps. Just do what the user asks.`,
      },
      {
        text: `When you receive a user request, notify them once that you are working on it and ask for their approval.
You only need to request approval once during the entire conversation.
Only one tool can run at a time - do not run multiple tools simultaneously.
Once the tool returns a result, you need to verify that with the current screenshot. If the result is not correct, you need to retry again (without asking for approval again).
`,
      },
    ],
  };
  return {
    model: "models/gemini-2.0-flash-exp",
    systemInstruction,
    tools,
  };
}
