"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL } from "@/constants/admin";
import { Resend } from "resend";
import { generateNotificationEmail } from "@/emails/notification";

export type AuthState = {
  type?: "error" | "success";
  message?: string;
  formData?: Record<string, string>;
};

export const signUpAction = async (
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const companyName = formData.get("companyName")?.toString();
  const intendedUsage = formData.get("intendedUsage")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const formValues = {
    email: email || "",
    name: name || "",
    companyName: companyName || "",
    intendedUsage: intendedUsage || "",
  };

  if (!email || !password || !name || !companyName) {
    return {
      type: "error",
      message: "Name, company name, email, and password are required",
      formData: formValues,
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name,
        company_name: companyName,
        ...(intendedUsage ? { intended_usage: intendedUsage } : {}),
      },
    },
  });

  // Send notification email to admin
  const notificationEmail = generateNotificationEmail(formValues);
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "app2agent<noreply@app2agent.com>",
    to: ADMIN_EMAIL,
    subject: notificationEmail.subject,
    html: notificationEmail.html,
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      type: "error",
      message: error.message,
      formData: formValues,
    };
  } else {
    return {
      type: "success",
      message:
        "Thanks for signing up! Please check your email for a verification link.",
    };
  }
};

export const signInAction = async (
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> => {
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

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return redirect(
      "/admin/reset-password?success=false&message=Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return redirect(
      "/admin/reset-password?success=false&message=Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return redirect(
      `/admin/reset-password?success=false&message=${error.message}`,
    );
  }

  return redirect(
    "/admin/reset-password?success=true&message=Password updated",
  );
};
