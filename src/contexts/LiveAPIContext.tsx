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

import { createContext, FC, ReactNode, useContext, useState } from "react";
import { UserConfig } from "../hooks/use-config";
import { useLiveAPI, UseLiveAPIResults } from "../hooks/use-live-api";
import { LiveConfig } from "@/multimodal-live-types";

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
  const systemInstruction = {
    parts: [
      {
        text: "You're IT support. If the user connects, welcome him/her with a suitable greeting.",
      },
      {
        text: `Use the following context if helpful:\n###\n${manual}\n###\n`,
      },
    ],
  };
  return {
    model: "models/gemini-2.0-flash-exp",
    systemInstruction,
  };
}
