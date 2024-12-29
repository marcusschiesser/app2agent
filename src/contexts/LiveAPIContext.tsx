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

import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { useLiveAPI, UseLiveAPIResults } from "../hooks/use-live-api";
import { useConfig } from "../hooks/use-config";

type LiveAPIContextValue = {
  liveAPI: UseLiveAPIResults | null;
  isConfigLoading: boolean;
};

const LiveAPIContext = createContext<LiveAPIContextValue | undefined>(
  undefined,
);

export type LiveAPIProviderProps = {
  children: ReactNode;
  url?: string;
};

const DEFAULT_INSTRUCTION =
  "You're IT support. If the user connects, welcome him/her with a suitable greeting.";

export const LiveAPIProvider: FC<LiveAPIProviderProps> = ({
  url,
  children,
}) => {
  const { manual, apiKey, isLoading } = useConfig();

  const api = useMemo(() => {
    if (isLoading || !apiKey || !manual) return null;
    const api = useLiveAPI({
      url,
      apiKey,
    });
    const MANUAL_INSTRUCTION = `Use the following context if helpful:\n###\n${manual}\n###\n`;
    const parts = [{ text: DEFAULT_INSTRUCTION }, { text: MANUAL_INSTRUCTION }];
    api.setConfig({
      model: "models/gemini-2.0-flash-exp",
      systemInstruction: { parts },
    });
    return api;
  }, [manual, isLoading, apiKey]);

  const contextValue: LiveAPIContextValue = {
    liveAPI: api,
    isConfigLoading: isLoading,
  };

  return (
    <LiveAPIContext.Provider value={contextValue}>
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
