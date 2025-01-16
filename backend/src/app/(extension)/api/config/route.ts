import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url"); // domain eg: linkedin.com
    const userId = request.headers.get("x-user-id");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 },
      );
    }

    // Get the manual for this URL and user
    const { data } = await supabaseAdmin
      .from("user_manuals")
      .select("content,gemini_key")
      .eq("url", url)
      .eq("user_id", userId)
      .single();

    if (!data) {
      return NextResponse.json({ error: "Manual not found" }, { status: 404 });
    }

    return NextResponse.json({
      content: data.content,
      apiKey: data.gemini_key,
    });
  } catch (error) {
    console.error("Error fetching manual:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
