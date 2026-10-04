import { NextResponse } from "next/server";

import { analyzePullRequest } from "@/server/ai";
import { auth } from "@/server/auth";
import { GitHubServiceError, getPullRequestContext, getRepository } from "@/server/github";
import { persistAnalysis } from "@/server/services/analysis-storage";

export async function POST(
  request: Request,
  props: { params: Promise<{ owner: string; repo: string; number: string }> }
) {
  try {
    // 1. Authenticate
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to continue", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // 2-4. Validate parameters
    const { owner, repo, number: numberParam } = await props.params;
    const prNumber = parseInt(numberParam, 10);

    if (!owner || !repo || isNaN(prNumber)) {
      return NextResponse.json(
        { error: "Valid owner, repo, and pull request number are required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    // 5-8. Fetch repository and normalized PR context (with context limits applied)
    const [repository, context] = await Promise.all([
      getRepository(owner, repo, session.user.id),
      getPullRequestContext(owner, repo, prNumber, session.user.id)
    ]);

    // 9-12. Run Gemini AI analysis + deterministic risk engine synthesis + Zod validation
    const analysisResult = await analyzePullRequest(context);

    // 13. Persist to PostgreSQL via Drizzle
    const storedRecord = await persistAnalysis({
      userId: session.user.id,
      repository,
      pullRequest: context.pullRequest,
      analysis: analysisResult
    });

    // 14. Return structured intelligence response
    return NextResponse.json(storedRecord);
  } catch (error) {
    if (error instanceof GitHubServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error("POST /api/github/repos/[owner]/[repo]/pulls/[number]/analyze error:", error);

    const errorMessage = error instanceof Error ? error.message : "Failed to analyze pull request";

    return NextResponse.json({ error: errorMessage, code: "ANALYSIS_FAILED" }, { status: 500 });
  }
}
