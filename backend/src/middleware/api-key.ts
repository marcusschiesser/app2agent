import { supabaseAdmin } from "@/utils/supabase/admin";
import { type NextRequest, NextResponse } from "next/server";

export async function handleApiKeyAuth(request: NextRequest) {
  // Only handle API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return null;
  }

  const apiKey = request.headers.get("x-api-key");

  // If no API key provided, skip API key auth
  if (!apiKey) {
    return null;
  }

  // Validate the API key
  const { data: validKey } = await supabaseAdmin
    .from("api_keys")
    .select("user_id")
    .eq("key", apiKey)
    .eq("is_active", true)
    .single();

  if (!validKey) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  // Add the user_id to the request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", validKey.user_id);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
