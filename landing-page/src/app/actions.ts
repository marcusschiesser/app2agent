"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = {
  isError?: boolean;
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
    return { isError: true, message: "Email and password are required" };
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
    return { isError: true, message: error.message };
  } else {
    return {
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
    return { isError: true, message: error.message };
  }

  return redirect("/dashboard");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth");
};
