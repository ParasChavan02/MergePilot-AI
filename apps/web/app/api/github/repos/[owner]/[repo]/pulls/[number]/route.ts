import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { analyses, pullRequests, repositories } from "@/db/schema";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { GitHubServiceError, getPullRequestContext } from "@/server/github";

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
        { error: "Valid owner, repo, and PR number are required", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const context = await getPullRequestContext(owner, repo, prNumber, session.user.id);

    // Check if an analysis already exists in the database
    let storedAnalysis = null;
    try {
      const repoRecord = (
        await db
          .select()
          .from(repositories)
          .where(eq(repositories.fullName, `${owner}/${repo}`))
          .limit(1)
      )[0];

      if (repoRecord) {
        const prRecord = (
          await db
            .select()
            .from(pullRequests)
            .where(
              and(eq(pullRequests.repositoryId, repoRecord.id), eq(pullRequests.number, prNumber))
            )
            .limit(1)
        )[0];

        if (prRecord) {
          const analysisRecord = (
            await db.select().from(analyses).where(eq(analyses.pullRequestId, prRecord.id)).limit(1)
          )[0];

          if (analysisRecord) {
            storedAnalysis = {
              id: analysisRecord.id,
              summary: analysisRecord.summary,
              risk: {
                level:
                  (analysisRecord.riskLevel as "low" | "medium" | "high" | "critical") || "low",
                score: analysisRecord.riskScore,
                reasons: (analysisRecord.metadata as { riskReasons?: string[] })?.riskReasons ?? []
              },
              keyChanges: analysisRecord.keyChanges ?? [],
              breakingChanges: analysisRecord.breakingChanges ?? {
                detected: analysisRecord.breakingChangeDetected,
                items: []
              },
              testGaps: analysisRecord.testGaps ?? [],
              recommendations: analysisRecord.recommendations ?? [],
              releaseNotes: analysisRecord.releaseNotes ?? analysisRecord.releaseNotesDraft ?? "",
              metadata: {
                analyzedAt: analysisRecord.createdAt.toISOString(),
                model: analysisRecord.modelVersion ?? "gemini-2.5-flash",
                contextTruncated: Boolean(
                  (analysisRecord.metadata as { contextTruncated?: boolean })?.contextTruncated
                )
              }
            };
          }
        }
      }
    } catch (dbErr) {
      console.warn("Error checking stored analysis:", dbErr);
    }

    return NextResponse.json({
      context,
      storedAnalysis
    });
  } catch (error) {
    if (error instanceof GitHubServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    console.error("GET /api/github/repos/[owner]/[repo]/pulls/[number] error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while fetching pull request details",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}
