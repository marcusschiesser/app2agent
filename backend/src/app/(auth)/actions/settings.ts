"use server";

import { createClient } from "@/utils/supabase/server";

export type SettingState = {
  isError?: boolean;
  message?: string;
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

  const { error } = await supabase.from("user_manuals").upsert(
    {
      url,
      user_id: user.id,
      gemini_key,
      content,
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
