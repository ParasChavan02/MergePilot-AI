import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { getStoredAnalysisForPR } from "@/server/services/analysis-storage";

export async function GET(
  request: Request,
  props: { params: Promise<{ owner: string; repo: string; number: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to continue", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { owner, repo, number: numberParam } = await props.params;
    const prNumber = parseInt(numberParam, 10);

    if (!owner || !repo || isNaN(prNumber)) {
      return NextResponse.json(
        { error: "Valid owner, repo, and pull request number are required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const storedAnalysis = await getStoredAnalysisForPR(owner, repo, prNumber);

    if (!storedAnalysis) {
      return NextResponse.json(
        { error: "No analysis found for this pull request", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(storedAnalysis);
  } catch (error) {
    console.error("GET /api/github/repos/[owner]/[repo]/pulls/[number]/analysis error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve analysis", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
