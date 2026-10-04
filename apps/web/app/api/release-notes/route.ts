import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { getUserReleaseNotesList } from "@/server/services/analysis-storage";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to continue", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const notes = await getUserReleaseNotesList(limit);

    return NextResponse.json({
      releaseNotes: notes,
      total: notes.length
    });
  } catch (error) {
    console.error("GET /api/release-notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch release notes", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
