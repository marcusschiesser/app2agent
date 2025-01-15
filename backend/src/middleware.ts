import { type NextRequest, NextResponse } from "next/server";
import { handleAuth } from "./middleware/auth";

export async function middleware(request: NextRequest) {
  try {
    // For other routes, handle session
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
