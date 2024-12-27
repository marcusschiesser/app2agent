"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = {
  type?: "error" | "success";
  message?: string;
};

export const authAction = async (
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> => {
  const type = formData.get("type") as string;
  const action = type === "signUp" ? signUpAction : signInAction;
  const result = await action(formData);
  return result;
};

export const signUpAction = async (formData: FormData): Promise<AuthState> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { type: "error", message: "Email and password are required" };
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  console.log(data);

  if (error) {
    console.error(error.code + " " + error.message);
    return { type: "error", message: error.message };
  } else {
    return {
      type: "success",
      message:
        "Thanks for signing up! Please check your email for a verification link.",
    };
  }
};

export const signInAction = async (formData: FormData): Promise<AuthState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { type: "error", message: error.message };
  }

  return redirect("/account");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth");
};

type SettingState = {
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
      onConflict: "url", // TODO: should be unique by combination of user_id and url
    },
  );

  if (error) {
    return { isError: true, message: error.message };
  }

  return { isError: false, message: "Settings saved" };
}
