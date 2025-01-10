"use client";

import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export const AuthContext = createContext<{ user: User } | null>(null);

export function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
