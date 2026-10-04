import { NextResponse } from "next/server";

import { analyzePullRequest } from "@/server/ai";
import { auth } from "@/server/auth";
import { GitHubServiceError, getPullRequestContext, getRepository } from "@/server/github";
import {
  getDashboardStats,
  getUserAnalysesList,
  persistAnalysis
} from "@/server/services/analysis-storage";

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
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const [analyses, stats] = await Promise.all([getUserAnalysesList(limit), getDashboardStats()]);

    return NextResponse.json({
      analyses,
      stats
    });
  } catch (error) {
    console.error("GET /api/analysis error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to continue", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const owner = String(body.owner || "");
    const repo = String(body.repo || "");
    const number = Number(body.number);

    if (!owner || !repo || !Number.isInteger(number)) {
      return NextResponse.json(
        { error: "Invalid repository or pull request number", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const [repository, context] = await Promise.all([
      getRepository(owner, repo, session.user.id),
      getPullRequestContext(owner, repo, number, session.user.id)
    ]);

    const analysisResult = await analyzePullRequest(context);

    const storedRecord = await persistAnalysis({
      userId: session.user.id,
      repository,
      pullRequest: context.pullRequest,
      analysis: analysisResult
    });

    return NextResponse.json(storedRecord);
  } catch (error) {
    if (error instanceof GitHubServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error("PR analysis error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze pull request";

    return NextResponse.json({ error: message, code: "ANALYSIS_FAILED" }, { status: 500 });
  }
}
