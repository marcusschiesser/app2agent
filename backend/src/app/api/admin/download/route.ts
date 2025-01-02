import { NextResponse } from "next/server";
import path from "node:path";
import { createClient } from "@/utils/supabase/server";
import { readFile } from "node:fs/promises";

export async function GET() {
  // Check authentication using Supabase
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const zipPath = path.join(
    process.cwd(),
    "..",
    "extension",
    "dist",
    "extension.zip",
  );

  try {
    const fileBuffer = await readFile(zipPath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": 'attachment; filename="extension.zip"',
        "Content-Type": "application/zip",
      },
    });
  } catch (error) {
    console.error("Error serving extension.zip:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}
