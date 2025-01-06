import { createContext, useContext, ReactNode } from "react";
import { ToolManager } from "@/lib/tools/manager";

interface ToolsContextValue {
  tools: ToolManager;
}

const ToolsContext = createContext<ToolsContextValue | null>(null);

export function ToolsProvider({ children }: { children: ReactNode }) {
  const tools = new ToolManager();

  return (
    <ToolsContext.Provider value={{ tools }}>{children}</ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context.tools;
}
