"use server";

import { createClient } from "@/utils/supabase/server";

export type ApiKeyState = {
  isError?: boolean;
  message?: string;
  data?: {
    key?: string;
  };
};

export async function generateApiKeyAction(): Promise<ApiKeyState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { isError: true, message: "Not authenticated" };
  }

  // Deactivate all existing keys for this user
  await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  // Generate new active key
  const newApiKey = crypto.randomUUID();
  const { error } = await supabase.from("api_keys").insert({
    user_id: user.id,
    key: newApiKey,
    is_active: true,
  });

  if (error) {
    return { isError: true, message: error.message };
  }

  return {
    isError: false,
    message: "API key generated successfully",
    data: { key: newApiKey },
  };
}

export async function getApiKeyAction(): Promise<{
  key: string | null;
  keyId: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { key: null, keyId: null };
  }

  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("id, key")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  // If no active API key exists, generate one
  if (!apiKeys) {
    const newApiKey = crypto.randomUUID();
    const { data: newKey, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        key: newApiKey,
        is_active: true,
      })
      .select("id, key")
      .single();

    if (error) {
      console.error("Failed to generate API key:", error);
      return { key: null, keyId: null };
    }

    return {
      key: newKey.key,
      keyId: newKey.id,
    };
  }

  return {
    key: apiKeys.key || null,
    keyId: apiKeys.id || null,
  };
}

export async function regenerateApiKeyAction(): Promise<ApiKeyState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { isError: true, message: "Not authenticated" };
  }

  // Deactivate all existing keys for this user
  await supabase
    .from("api_keys")
    .update({ is_active: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  // Generate new active key
  const newApiKey = crypto.randomUUID();
  const { error } = await supabase.from("api_keys").insert({
    user_id: user.id,
    key: newApiKey,
    is_active: true,
  });

  if (error) {
    return { isError: true, message: error.message };
  }

  return {
    isError: false,
    message: "API key regenerated successfully",
    data: { key: newApiKey },
  };
}
