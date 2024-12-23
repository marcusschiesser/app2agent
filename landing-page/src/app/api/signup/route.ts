import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email, name, intendedUsage } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { error } = await supabase.from("email_signups").insert([
      {
        email,
        name,
        intended_usage: intendedUsage,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      // Check for unique_violation error code (23505 is PostgreSQL's unique constraint violation code)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You've already signed up! We'll be in touch soon." },
          { status: 409 },
        );
      }
      throw error;
    }

    return NextResponse.json(
      { message: "Successfully signed up!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error signing up:", error);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}
