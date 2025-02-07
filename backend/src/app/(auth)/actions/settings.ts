"use server";

import { createClient } from "@/utils/supabase/server";
import { DEFAULT_PROMPT } from "../../../config/promptDefaults";

export type SettingState = {
  isError?: boolean;
  message?: string;
};

export type WebApp = {
  id: string;
  gemini_key: string;
  url: string;
  context: string;
  user_id: string;
  prompt: string;
};

export async function updateSettingsAction(
  prevState: SettingState,
  formData: FormData,
): Promise<SettingState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { isError: true, message: "Not authenticated" };
  }

  const gemini_key = formData.get("gemini_key")?.toString();
  const url = formData.get("url")?.toString();
  const context = formData.get("context")?.toString();
  const prompt = formData.get("prompt")?.toString() || DEFAULT_PROMPT;

  const { error } = await supabase.from("user_manuals").upsert(
    {
      url,
      user_id: user.id,
      gemini_key,
      context,
      prompt,
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    return { isError: true, message: error.message };
  }

  return { isError: false, message: "Settings saved" };
}

export async function fetchSettingsAction(): Promise<{
  data: WebApp | null;
  error: Error | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: new Error("Not authenticated") };
  }

  const { data, error } = await supabase
    .from("user_manuals")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}
