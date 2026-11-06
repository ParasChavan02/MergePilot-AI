import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import {
  getAnalysesCollection,
  getPullRequestsCollection,
  getRepositoriesCollection
} from "@/server/db";
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

    // Check if an analysis already exists in MongoDB
    let storedAnalysis = null;
    try {
      const repositoriesCollection = await getRepositoriesCollection();
      const pullRequestsCollection = await getPullRequestsCollection();
      const analysesCollection = await getAnalysesCollection();

      const repoRecord = await repositoriesCollection.findOne({ fullName: `${owner}/${repo}` });

      if (repoRecord) {
        const prRecord = await pullRequestsCollection.findOne({
          repositoryId: repoRecord.id,
          number: prNumber
        });

        if (prRecord) {
          const analysisRecord = await analysesCollection.findOne({ pullRequestId: prRecord.id });

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
                analyzedAt: (analysisRecord.createdAt instanceof Date
                  ? analysisRecord.createdAt
                  : new Date(analysisRecord.createdAt)
                ).toISOString(),
                model:
                  analysisRecord.modelVersion ?? (process.env.GEMINI_MODEL || "gemini-3.5-flash"),
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
