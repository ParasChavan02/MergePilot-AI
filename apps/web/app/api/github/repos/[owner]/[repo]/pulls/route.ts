import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import { analyses, pullRequests, repositories } from "@/db/schema";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { GitHubServiceError, getRepositoryPullRequests } from "@/server/github";

export async function GET(
  request: Request,
  props: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to continue", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { owner, repo } = await props.params;

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo parameters are required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const stateParam = searchParams.get("state") || "open";
    const state = (["open", "closed", "all"].includes(stateParam) ? stateParam : "open") as
      "open" | "closed" | "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "30", 10);

    const prs = await getRepositoryPullRequests(owner, repo, {
      state,
      page,
      perPage,
      userId: session.user.id
    });

    // Check if any of these PRs have been analyzed in the database
    if (prs.length > 0) {
      try {
        const repoRecord = (
          await db
            .select()
            .from(repositories)
            .where(eq(repositories.fullName, `${owner}/${repo}`))
            .limit(1)
        )[0];

        if (repoRecord) {
          const prNumbers = prs.map((p) => p.number);
          const prRecords = await db
            .select()
            .from(pullRequests)
            .where(
              and(
                eq(pullRequests.repositoryId, repoRecord.id),
                inArray(pullRequests.number, prNumbers)
              )
            );

          if (prRecords.length > 0) {
            const prRecordIds = prRecords.map((r) => r.id);
            const prAnalyses = await db
              .select()
              .from(analyses)
              .where(inArray(analyses.pullRequestId, prRecordIds));

            const analysisByPrRecordId = new Map(prAnalyses.map((a) => [a.pullRequestId, a]));
            const prRecordByNumber = new Map(prRecords.map((r) => [r.number, r]));

            prs.forEach((pr) => {
              const record = prRecordByNumber.get(pr.number);
              if (record) {
                const analysis = analysisByPrRecordId.get(record.id);
                if (analysis) {
                  pr.analysis = {
                    id: analysis.id,
                    riskLevel:
                      (analysis.riskLevel as "low" | "medium" | "high" | "critical") || "low",
                    riskScore: analysis.riskScore,
                    analyzedAt: analysis.createdAt.toISOString()
                  };
                }
              }
            });
          }
        }
      } catch (dbErr) {
        // Non-critical: if DB lookup fails, return PRs without analysis metadata
        console.warn("Error cross-referencing PR analyses with DB:", dbErr);
      }
    }

    return NextResponse.json({
      pullRequests: prs,
      total: prs.length,
      page,
      state
    });
  } catch (error) {
    if (error instanceof GitHubServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error("GET /api/github/repos/[owner]/[repo]/pulls error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while fetching pull requests",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}
