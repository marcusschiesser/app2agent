import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url"); // domain eg: linkedin.com
    const apiKey = request.headers.get("x-api-key");
    const requestOrigin = request.headers.get("origin"); // origin eg: https://www.linkedin.com

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 },
      );
    }

    // If API key is provided, validate it first
    if (apiKey) {
      const { data: validKey } = await supabase
        .from("user_manuals")
        .select("id")
        .eq("url", url)
        .eq("api_key", apiKey)
        .single();

      if (!validKey) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }
    }
    // If no API key and different origin, require API key
    else if (requestOrigin && !requestOrigin.includes(url)) {
      return NextResponse.json(
        { error: "API key is required for cross-origin requests" },
        { status: 401 },
      );
    }

    // If we get here, either:
    // 1. API key is valid, or
    // 2. Same origin request (no API key needed)
    const { data, error } = await supabase
      .from("user_manuals")
      .select("content,gemini_key")
      .eq("url", url)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch manual" },
        { status: 500 },
      );
    }

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
