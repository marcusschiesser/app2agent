"use server";

import { createClient } from "@/utils/supabase/server";

export type SettingState = {
  isError?: boolean;
  message?: string;
  data?: {
    api_key?: string;
  };
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
  const content = formData.get("content")?.toString();
  const api_key = formData.get("api_key")?.toString();

  const { error } = await supabase.from("user_manuals").upsert(
    {
      url,
      user_id: user.id,
      gemini_key,
      content,
      api_key,
    },
    {
      onConflict: "url", // TODO: should be unique by combination of user_id and url
    },
  );

  if (error) {
    return { isError: true, message: error.message };
  }

  return { isError: false, message: "Settings saved" };
}

export async function regenerateApiKeyAction(
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

  const id = formData.get("id")?.toString();
  if (!id) {
    return { isError: true, message: "Manual ID is required" };
  }

  const newApiKey = crypto.randomUUID();

  const { error } = await supabase
    .from("user_manuals")
    .update({ api_key: newApiKey })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { isError: true, message: error.message };
  }

  return {
    isError: false,
    message: "API key regenerated",
    data: { api_key: newApiKey },
  };
}

export async function getApiKeyAction(): Promise<{
  apiKey: string | null;
  manualId: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { apiKey: null, manualId: null };
  }

  const { data: manuals } = await supabase
    .from("user_manuals")
    .select("id, api_key")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  return {
    apiKey: manuals?.[0]?.api_key || null,
    manualId: manuals?.[0]?.id || null,
  };
}
