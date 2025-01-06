import { ADMIN_EMAIL } from "@/constants/admin";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { generateInviteEmail } from "@/emails/notification";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only admin can trigger this endpoint
    if (user?.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    // Get all email signups that haven't been invited yet
    const { data: signups, error } = await adminSupabase
      .from("email_signups")
      .select("*")
      .or("invite_sent.eq.false,invite_sent.is.null");

    if (error) {
      console.error("Error fetching signups:", error);
      return NextResponse.json(
        { error: "Failed to fetch email signups" },
        { status: 500 },
      );
    }

    if (!signups || signups.length === 0) {
      return NextResponse.json({ message: "No pending invites found" });
    }

    const results = [];
    for (const signup of signups) {
      try {
        // Generate signup URL with prefilled data
        const signupParams = new URLSearchParams({
          signup: "true",
          email: signup.email,
          name: signup.name || "",
          companyName: signup.company_name || "",
          intendedUsage: signup.intended_usage || "",
          linkedInProfile: signup.linkedin_profile || "",
        });

        const signupUrl = `https://www.app2agent.com/auth?${signupParams.toString()}`;

        // Send invite email using Resend
        await resend.emails.send(
          generateInviteEmail({
            email: signup.email,
            name: signup.name || "",
            signupUrl,
          }),
        );

        // Mark invite as sent
        const { error: updateError } = await adminSupabase
          .from("email_signups")
          .update({ invite_sent: true })
          .eq("id", signup.id);

        if (updateError) {
          throw updateError;
        }

        results.push({
          email: signup.email,
          status: "success",
          message: "Invite sent successfully",
        });
      } catch (error) {
        console.error(`Error processing invite for ${signup.email}:`, error);
        results.push({
          email: signup.email,
          status: "error",
          message: "Failed to send invite",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error processing invites:", error);
    return NextResponse.json(
      { error: "Failed to process invitations" },
      { status: 500 },
    );
  }
}
