import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { analyses, pullRequests, releaseNotes, repositories } from "@/db/schema";
import type { FinalAnalysisResult } from "@/server/ai/schemas";
import { db } from "@/server/db";
import type { GitHubPullRequest, GitHubRepository } from "@/server/github/types";

interface PersistAnalysisOptions {
  userId: string;
  repository: GitHubRepository;
  pullRequest: GitHubPullRequest;
  analysis: FinalAnalysisResult;
}

export async function persistAnalysis({
  userId,
  repository,
  pullRequest,
  analysis
}: PersistAnalysisOptions) {
  // 1. Ensure repository exists in DB
  let repoRecord = (
    await db
      .select()
      .from(repositories)
      .where(eq(repositories.fullName, repository.full_name))
      .limit(1)
  )[0];

  if (!repoRecord) {
    const [newRepo] = await db
      .insert(repositories)
      .values({
        ownerId: userId,
        githubId: repository.id,
        name: repository.name,
        fullName: repository.full_name,
        defaultBranch: repository.default_branch,
        private: repository.private,
        description: repository.description,
        htmlUrl: repository.html_url
      })
      .returning();
    repoRecord = newRepo;
  }

  if (!repoRecord) {
    throw new Error("Failed to ensure repository record in database");
  }

  // 2. Ensure pull request exists in DB
  let prRecord = (
    await db
      .select()
      .from(pullRequests)
      .where(
        and(
          eq(pullRequests.repositoryId, repoRecord.id),
          eq(pullRequests.number, pullRequest.number)
        )
      )
      .limit(1)
  )[0];

  if (!prRecord) {
    const [newPr] = await db
      .insert(pullRequests)
      .values({
        repositoryId: repoRecord.id,
        githubId: pullRequest.id,
        number: pullRequest.number,
        title: pullRequest.title,
        body: pullRequest.body,
        authorLogin: pullRequest.author.login,
        state: pullRequest.state,
        isDraft: pullRequest.draft,
        headSha: pullRequest.head.sha,
        baseSha: pullRequest.base.sha,
        headRef: pullRequest.head.ref,
        baseRef: pullRequest.base.ref,
        mergedAt: pullRequest.merged_at ? new Date(pullRequest.merged_at) : null,
        closedAt: pullRequest.closed_at ? new Date(pullRequest.closed_at) : null
      })
      .returning();
    prRecord = newPr;
  } else {
    // Update existing PR record with latest metadata
    const [updatedPr] = await db
      .update(pullRequests)
      .set({
        title: pullRequest.title,
        body: pullRequest.body,
        state: pullRequest.state,
        headSha: pullRequest.head.sha,
        mergedAt: pullRequest.merged_at ? new Date(pullRequest.merged_at) : null,
        closedAt: pullRequest.closed_at ? new Date(pullRequest.closed_at) : null,
        updatedAt: new Date()
      })
      .where(eq(pullRequests.id, prRecord.id))
      .returning();
    prRecord = updatedPr;
  }

  if (!prRecord) {
    throw new Error("Failed to ensure pull request record in database");
  }

  // 3. Save analysis record
  const [analysisRecord] = await db
    .insert(analyses)
    .values({
      pullRequestId: prRecord.id,
      userId,
      repositoryId: repoRecord.id,
      status: "complete",
      summary: analysis.summary,
      riskLevel: analysis.risk.level,
      riskScore: analysis.risk.score,
      breakingChangeDetected: analysis.breakingChanges.detected,
      keyChanges: analysis.keyChanges,
      breakingChanges: analysis.breakingChanges,
      testGaps: analysis.testGaps,
      recommendations: analysis.recommendations,
      releaseNotes: analysis.releaseNotes,
      releaseNotesDraft: analysis.releaseNotes,
      modelVersion: analysis.metadata.model,
      metadata: {
        riskReasons: analysis.risk.reasons,
        deterministicSignals: analysis.metadata.deterministicRiskSignals,
        contextTruncated: analysis.metadata.contextTruncated
      }
    })
    .returning();

  if (!analysisRecord) {
    throw new Error("Failed to insert analysis record");
  }

  // 4. Save release note draft if generated
  if (analysis.releaseNotes && analysis.releaseNotes.trim().length > 0) {
    await db.insert(releaseNotes).values({
      analysisId: analysisRecord.id,
      repositoryId: repoRecord.id,
      title: `${repository.full_name} #${pullRequest.number}: ${pullRequest.title}`,
      body: analysis.releaseNotes,
      type: analysis.breakingChanges.detected ? "breaking" : "feature",
      isPublished: false
    });
  }

  return {
    id: analysisRecord.id,
    summary: analysisRecord.summary,
    risk: analysis.risk,
    keyChanges: analysis.keyChanges,
    breakingChanges: analysis.breakingChanges,
    testGaps: analysis.testGaps,
    recommendations: analysis.recommendations,
    releaseNotes: analysis.releaseNotes,
    metadata: {
      analyzedAt: analysisRecord.createdAt.toISOString(),
      model: analysisRecord.modelVersion ?? (process.env.GEMINI_MODEL || "gemini-3.5-flash"),
      contextTruncated: analysis.metadata.contextTruncated
    }
  };
}

export async function getStoredAnalysisForPR(owner: string, repo: string, prNumber: number) {
  const repoRecord = (
    await db
      .select()
      .from(repositories)
      .where(eq(repositories.fullName, `${owner}/${repo}`))
      .limit(1)
  )[0];

  if (!repoRecord) return null;

  const prRecord = (
    await db
      .select()
      .from(pullRequests)
      .where(and(eq(pullRequests.repositoryId, repoRecord.id), eq(pullRequests.number, prNumber)))
      .limit(1)
  )[0];

  if (!prRecord) return null;

  const analysisRecord = (
    await db
      .select()
      .from(analyses)
      .where(eq(analyses.pullRequestId, prRecord.id))
      .orderBy(desc(analyses.createdAt))
      .limit(1)
  )[0];

  if (!analysisRecord) return null;

  const metadata =
    (analysisRecord.metadata as {
      riskReasons?: string[];
      contextTruncated?: boolean;
    }) ?? {};

  return {
    id: analysisRecord.id,
    summary: analysisRecord.summary ?? "",
    risk: {
      level: (analysisRecord.riskLevel as "low" | "medium" | "high" | "critical") || "low",
      score: analysisRecord.riskScore,
      reasons: metadata.riskReasons ?? []
    },
    keyChanges: analysisRecord.keyChanges ?? [],
    breakingChanges: analysisRecord.breakingChanges ?? {
      detected: analysisRecord.breakingChangeDetected,
      severity: "none",
      items: []
    },
    testGaps: analysisRecord.testGaps ?? [],
    recommendations: analysisRecord.recommendations ?? [],
    releaseNotes: analysisRecord.releaseNotes ?? analysisRecord.releaseNotesDraft ?? "",
    metadata: {
      analyzedAt: analysisRecord.createdAt.toISOString(),
      model: analysisRecord.modelVersion ?? (process.env.GEMINI_MODEL || "gemini-3.5-flash"),
      contextTruncated: Boolean(metadata.contextTruncated)
    }
  };
}

export async function getUserAnalysesList(limit = 20) {
  const recentAnalyses = await db
    .select({
      analysis: analyses,
      pullRequest: pullRequests,
      repository: repositories
    })
    .from(analyses)
    .innerJoin(pullRequests, eq(analyses.pullRequestId, pullRequests.id))
    .innerJoin(repositories, eq(pullRequests.repositoryId, repositories.id))
    .orderBy(desc(analyses.createdAt))
    .limit(limit);

  return recentAnalyses.map(({ analysis, pullRequest, repository }) => ({
    id: analysis.id,
    repository: {
      fullName: repository.fullName,
      name: repository.name
    },
    pullRequest: {
      number: pullRequest.number,
      title: pullRequest.title,
      state: pullRequest.state,
      authorLogin: pullRequest.authorLogin
    },
    risk: {
      level: (analysis.riskLevel as "low" | "medium" | "high" | "critical") || "low",
      score: analysis.riskScore,
      reasons: (analysis.metadata as { riskReasons?: string[] })?.riskReasons ?? []
    },
    summary: analysis.summary ?? "",
    breakingChangesCount:
      analysis.breakingChanges?.items?.length ?? (analysis.breakingChangeDetected ? 1 : 0),
    testGapsCount: analysis.testGaps?.length ?? 0,
    analyzedAt: analysis.createdAt.toISOString()
  }));
}

export async function getUserReleaseNotesList(limit = 30) {
  const notes = await db
    .select({
      releaseNote: releaseNotes,
      repository: repositories,
      analysis: analyses,
      pullRequest: pullRequests
    })
    .from(releaseNotes)
    .innerJoin(repositories, eq(releaseNotes.repositoryId, repositories.id))
    .innerJoin(analyses, eq(releaseNotes.analysisId, analyses.id))
    .innerJoin(pullRequests, eq(analyses.pullRequestId, pullRequests.id))
    .orderBy(desc(releaseNotes.createdAt))
    .limit(limit);

  return notes.map(({ releaseNote, repository, pullRequest, analysis }) => ({
    id: releaseNote.id,
    repositoryName: repository.fullName,
    prNumber: pullRequest.number,
    prTitle: pullRequest.title,
    summary: analysis.summary ?? "",
    releaseNotes: releaseNote.body,
    type: releaseNote.type,
    createdAt: releaseNote.createdAt.toISOString()
  }));
}

export async function getDashboardStats() {
  const [totalReposResult] = await db
    .select({ count: sql<number>`count(distinct ${repositories.id})::int` })
    .from(repositories);

  const [openPrsResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pullRequests)
    .where(eq(pullRequests.state, "open"));

  const [analyzedPrsResult] = await db
    .select({ count: sql<number>`count(distinct ${analyses.pullRequestId})::int` })
    .from(analyses);

  const [highRiskResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(analyses)
    .where(inArray(analyses.riskLevel, ["high", "critical"]));

  return {
    repositoriesCount: totalReposResult?.count ?? 0,
    openPrsCount: openPrsResult?.count ?? 0,
    analyzedPrsCount: analyzedPrsResult?.count ?? 0,
    highRiskCount: highRiskResult?.count ?? 0
  };
}
