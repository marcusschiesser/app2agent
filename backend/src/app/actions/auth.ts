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
  const inviteCode = formData.get("invite_code")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!inviteCode || inviteCode !== process.env.INVITE_CODE) {
    return {
      type: "error",
      message: "We are in beta now, please submit waitlist form to be invited.",
    };
  }

  if (!email || !password) {
    return { type: "error", message: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

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

  return redirect("/admin");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth");
};
