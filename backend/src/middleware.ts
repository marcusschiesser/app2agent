import { type NextRequest, NextResponse } from "next/server";
import { handleAuth } from "./middleware/auth";
import { handleApiKeyAuth } from "./middleware/api-key";
import { handleCORS } from "./middleware/cors";

export async function middleware(request: NextRequest) {
  try {
    // Handle API routes with API key and CORS middleware chain
    if (request.nextUrl.pathname.startsWith("/api/")) {
      // 1. Pre-flight CORS check
      if (request.method === "OPTIONS") {
        return await handleCORS(request);
      }

      // 2. API key validation
      const apiResponse = await handleApiKeyAuth(request);
      if (apiResponse) {
        // Add CORS headers to error response
        return await handleCORS(request, apiResponse);
      }
    }

    // For other routes, handle session auth
    return await handleAuth(request);
  } catch (error) {
    console.error("[Middleware] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
