import { type NextRequest, NextResponse } from "next/server";
import { handleAuth } from "./middleware/auth";
import { handleApiKeyAuth } from "./middleware/api-key";

export async function middleware(request: NextRequest) {
  try {
    // First try API key auth for API routes
    const apiKeyResponse = await handleApiKeyAuth(request);
    if (apiKeyResponse) {
      return apiKeyResponse;
    }

    // For other routes or when no API key is present, handle session auth
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
