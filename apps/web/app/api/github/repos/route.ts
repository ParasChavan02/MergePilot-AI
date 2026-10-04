import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { GitHubServiceError, getUserRepositories } from "@/server/github";

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
    const sort = (searchParams.get("sort") as "updated" | "pushed" | "full_name") || "updated";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "50", 10);

    const repositories = await getUserRepositories({
      userId: session.user.id,
      sort,
      page,
      perPage
    });

    return NextResponse.json({
      repositories,
      total: repositories.length,
      page
    });
  } catch (error) {
    if (error instanceof GitHubServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error("GET /api/github/repos error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching repositories", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
