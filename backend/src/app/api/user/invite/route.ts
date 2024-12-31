import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // TODO: check the user is calling this endpoint is ADMIN_EMAIL

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
  const results = [];
  for (const email of emailList) {
    // 1. Check if email exists in signups and isn't already invited
    const { data: signup } = await supabase
      .from("email_signups")
      .select("*")
      .eq("email", email)
      .or("invite_sent.eq.false,invite_sent.is.null")
      .single();

    if (!signup) {
      results.push({
        email,
        status: "error",
        message: "Email not found in signups or already invited",
      });
      continue;
    }

    // 2. Create user in Supabase Auth
    const { error: createUserError } = await supabase.auth.admin.createUser({
      email: email,
      email_confirm: false,
      user_metadata: {
        name: signup.name,
        company: signup.company_name,
      },
    });

    if (createUserError) {
      results.push({
        email,
        status: "error",
        message: createUserError.message,
      });
      continue;
    }

    // 3. Send invitation email
    try {
      await supabase.auth.admin.inviteUserByEmail(email);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      results.push({
        email,
        status: "error",
        message: "Failed to send invitation email",
      });
      continue;
    }

    // 4. Mark the invite as sent
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
