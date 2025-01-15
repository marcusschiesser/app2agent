import { type NextRequest, NextResponse } from "next/server";

export const handleCORS = async (
  request: NextRequest,
  response?: NextResponse,
) => {
  response = response || NextResponse.next();

  // need an origin to handle cors
  const origin = request.headers.get("origin");

  if (!origin) {
    console.error("[CORS] No origin found in request");
    return response;
  }

  if (request.method === "OPTIONS") {
    console.log("[CORS] Handling OPTIONS preflight request");
    // preflight check
    const preflightResponse = new NextResponse(null, { status: 204 });
    setCORSHeaders(preflightResponse, origin);
    return preflightResponse;
  }

  // add cors headers to response
  setCORSHeaders(response, origin);
  return response;
};

export const setCORSHeaders = (response: NextResponse, origin: string) => {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-Extension-Id, X-Requested-With, Content-Type, X-Api-Key",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Vary", "Origin");
};
