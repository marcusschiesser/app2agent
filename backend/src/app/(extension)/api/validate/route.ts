import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // The middleware has already validated the API key and set x-user-id
    // If we reach this point, the API key is valid
    const userId = request.headers.get("x-user-id");

    return NextResponse.json({
      valid: true,
      userId,
    });
  } catch (error) {
    console.error("[Validate API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
