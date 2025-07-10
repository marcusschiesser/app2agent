import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { gemini, GEMINI_MODEL } from "@llamaindex/google";
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
      .select("context,gemini_key,prompt")
      .eq("url", url)
      .eq("user_id", userId)
      .single();

    if (!data) {
      return NextResponse.json({ error: "Manual not found" }, { status: 404 });
    }

    //get the ephemeral key
    const serverLLM = gemini({
      apiKey: data.gemini_key,
      model: GEMINI_MODEL.GEMINI_2_0_FLASH_LIVE,
      httpOptions: { apiVersion: "v1alpha" },
    });

    const ephemeralKey = await serverLLM.live.getEphemeralKey();

    return NextResponse.json({
      context: data.context,
      prompt: data.prompt,
      apiKey: ephemeralKey,
    });
  } catch (error) {
    console.error("Error fetching manual:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
