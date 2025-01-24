import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const contentType = response.headers.get("content-type");
    const body = await response.text();

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType || "text/html",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
  }
}
