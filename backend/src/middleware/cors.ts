import { type NextRequest, NextResponse } from "next/server";

// Get allowed extension IDs from environment variable
const ALLOWED_EXTENSION_IDS =
  process.env.ALLOWED_EXTENSION_IDS?.split(",") || [];

export const handleCORS = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  console.log("[CORS] Check permission for origin:", origin);

  if (!origin) {
    const apiKey = request.headers.get("x-api-key");

    if (apiKey) {
      console.log("[CORS] No origin but API key provided, allowing request");
      return NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
    }

    console.error("[CORS] No origin and no API key found in request");
    return new NextResponse(
      "Unauthorized request. Origin or API key required",
      {
        status: 401,
      },
    );
  }

  if (request.method === "OPTIONS") {
    console.log("[CORS] Handling OPTIONS preflight request");
    // preflight check
    const response = new NextResponse(null, { status: 204 });
    setCORSHeaders(response, origin);
    return response;
  }

  // handle actual requests after preflight (GET and POST)
  const extensionId = request.headers.get("x-extension-id");
  if (
    ALLOWED_EXTENSION_IDS.length === 0 ||
    (extensionId && ALLOWED_EXTENSION_IDS.includes(extensionId))
  ) {
    console.log("[CORS] Request authorized");
    // allow all extensions if ALLOWED_EXTENSION_IDS is empty, otherwise only allow listed extensions
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    setCORSHeaders(response, origin);
    return response;
  } else {
    return new NextResponse("Unauthorized request. Extension ID not allowed", {
      status: 401,
    });
  }
};

const setCORSHeaders = (response: NextResponse, origin: string) => {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-Extension-Id, X-Api-Key, X-Requested-With, Content-Type",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Vary", "Origin");
};
