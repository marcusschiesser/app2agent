import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateConfirmationEmail } from "@/emails/confirmation";
import { generateNotificationEmail } from "@/emails/notification";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "marcus@app2agent.com";
const ADMIN_NAME = "Marcus Schiesser";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email, name, companyName, intendedUsage } = await request.json();

    if (!email || !companyName || !name) {
      return NextResponse.json(
        { error: "Email, name and company name are required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("email_signups").insert([
      {
        email,
        name,
        company_name: companyName,
        intended_usage: intendedUsage,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      // Check for unique_violation error code (23505 is PostgreSQL's unique constraint violation code)
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "You've already signed up! We'll be in touch soon.",
          },
          { status: 409 },
        );
      }
      throw error;
    }

    // Send confirmation email to user
    const confirmationEmail = generateConfirmationEmail(email, name);
    await resend.emails.send({
      from: `${ADMIN_NAME} <${ADMIN_EMAIL}>`,
      to: email,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html,
    });

    // Send notification email to admin
    const notificationEmail = generateNotificationEmail(
      email,
      name,
      intendedUsage,
    );
    await resend.emails.send({
      from: "app2agent<noreply@app2agent.com>",
      to: ADMIN_EMAIL,
      subject: notificationEmail.subject,
      html: notificationEmail.html,
    });

    return NextResponse.json(
      { message: "Successfully signed up!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error signing up:", error);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}
