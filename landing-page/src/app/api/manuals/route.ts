import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_manuals")
      .select("content")
      .eq("url", url)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch markdown file" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Markdown file not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ content: data.content });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
