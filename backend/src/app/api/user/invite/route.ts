import { ADMIN_EMAIL } from "@/constants/admin";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emails = searchParams.get("emails");

    if (!emails) {
      return NextResponse.json(
        { error: "Emails parameter is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const emailList = emails.split(",").map((email) => email.trim());
    const results = await sendInvitations(emailList);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error processing invites:", error);
    return NextResponse.json(
      { error: "Failed to process invitations" },
      { status: 500 },
    );
  }
}

async function sendInvitations(emailList: string[]) {
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const results = [];
  for (const email of emailList) {
    // 1. Check if email exists in signups or already invited
    const { data: signup } = await supabase
      .from("email_signups")
      .select("*")
      .eq("email", email)
      .single();

    if (!signup) {
      results.push({
        email,
        status: "error",
        message: "Email not found in waitlist",
      });
      continue;
    }

    if (signup.invite_sent) {
      results.push({
        email,
        status: "error",
        message: "Invitation already sent",
      });
      continue;
    }

    // 2. Send invitation email (will automatically create user in Supabase Auth)
    try {
      await supabase.auth.admin.inviteUserByEmail(email, {
        // store additional metadata about the user (maps to auth.users.user_metadata)
        data: {
          name: signup.name,
          company: signup.company_name,
        },
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      results.push({
        email,
        status: "error",
        message: "Failed to send invitation email",
      });
      continue;
    }

    // 3. Mark the invite as sent
    const { error: updateError } = await supabase
      .from("email_signups")
      .update({ invite_sent: true })
      .eq("id", signup.id);

    if (updateError) {
      results.push({
        email,
        status: "error",
        message: "Failed to update verification status",
      });
      continue;
    }

    results.push({
      email,
      status: "success",
      message: "User invited successfully",
    });
  }
  return results;
}
