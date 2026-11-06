import crypto from "node:crypto";

import type { FinalAnalysisResult } from "@/server/ai/schemas";
import {
  getAnalysesCollection,
  getPullRequestsCollection,
  getReleaseNotesCollection,
  getRepositoriesCollection
} from "@/server/db";
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
  const repositoriesCollection = await getRepositoriesCollection();
  const pullRequestsCollection = await getPullRequestsCollection();
  const analysesCollection = await getAnalysesCollection();
  const releaseNotesCollection = await getReleaseNotesCollection();

  const now = new Date();

  // 1. Ensure repository exists in MongoDB
  let repoRecord = await repositoriesCollection.findOne({ fullName: repository.full_name });

  if (!repoRecord) {
    const newRepoId = crypto.randomUUID();
    const doc = {
      id: newRepoId,
      ownerId: userId,
      githubId: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      defaultBranch: repository.default_branch,
      private: repository.private,
      description: repository.description,
      htmlUrl: repository.html_url,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    const insertResult = await repositoriesCollection.insertOne(doc);
    repoRecord = { ...doc, _id: insertResult.insertedId };
  }

  // 2. Ensure pull request exists in MongoDB
  let prRecord = await pullRequestsCollection.findOne({
    repositoryId: repoRecord.id,
    number: pullRequest.number
  });

  if (!prRecord) {
    const newPrId = crypto.randomUUID();
    const doc = {
      id: newPrId,
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
      closedAt: pullRequest.closed_at ? new Date(pullRequest.closed_at) : null,
      createdAt: now,
      updatedAt: now
    };
    const insertResult = await pullRequestsCollection.insertOne(doc);
    prRecord = { ...doc, _id: insertResult.insertedId };
  } else {
    await pullRequestsCollection.updateOne(
      { id: prRecord.id },
      {
        $set: {
          title: pullRequest.title,
          body: pullRequest.body,
          state: pullRequest.state,
          headSha: pullRequest.head.sha,
          mergedAt: pullRequest.merged_at ? new Date(pullRequest.merged_at) : null,
          closedAt: pullRequest.closed_at ? new Date(pullRequest.closed_at) : null,
          updatedAt: now
        }
      }
    );
  }

  // 3. Save analysis record
  const newAnalysisId = crypto.randomUUID();
  const analysisDoc = {
    id: newAnalysisId,
    pullRequestId: prRecord.id,
    userId,
    repositoryId: repoRecord.id,
    status: "complete" as const,
    summary: analysis.summary,
    riskLevel: analysis.risk.level,
    riskScore: analysis.risk.score,
    breakingChangeDetected: analysis.breakingChanges.detected,
    keyChanges: analysis.keyChanges,
    breakingChanges: analysis.breakingChanges,
    testGaps: analysis.testGaps,
    recommendations: analysis.recommendations,
    releaseNotes: analysis.releaseNotes,
    testSuggestions: [],
    releaseNotesDraft: analysis.releaseNotes,
    modelVersion: analysis.metadata.model,
    metadata: {
      riskReasons: analysis.risk.reasons,
      deterministicSignals: analysis.metadata.deterministicRiskSignals,
      contextTruncated: analysis.metadata.contextTruncated
    },
    createdAt: now,
    updatedAt: now
  };

  await analysesCollection.insertOne(analysisDoc);

  // 4. Save release note draft if generated
  if (analysis.releaseNotes && analysis.releaseNotes.trim().length > 0) {
    const newReleaseNoteId = crypto.randomUUID();
    await releaseNotesCollection.insertOne({
      id: newReleaseNoteId,
      analysisId: newAnalysisId,
      repositoryId: repoRecord.id,
      title: `${repository.full_name} #${pullRequest.number}: ${pullRequest.title}`,
      body: analysis.releaseNotes,
      type: analysis.breakingChanges.detected ? "breaking" : "feature",
      isPublished: false,
      createdAt: now
    });
  }

  return {
    id: newAnalysisId,
    summary: analysisDoc.summary,
    risk: analysis.risk,
    keyChanges: analysis.keyChanges,
    breakingChanges: analysis.breakingChanges,
    testGaps: analysis.testGaps,
    recommendations: analysis.recommendations,
    releaseNotes: analysis.releaseNotes,
    metadata: {
      analyzedAt: now.toISOString(),
      model: analysisDoc.modelVersion ?? (process.env.GEMINI_MODEL || "gemini-3.5-flash"),
      contextTruncated: analysis.metadata.contextTruncated
    }
  };
}

export async function getStoredAnalysisForPR(owner: string, repo: string, prNumber: number) {
  const repositoriesCollection = await getRepositoriesCollection();
  const pullRequestsCollection = await getPullRequestsCollection();
  const analysesCollection = await getAnalysesCollection();

  const repoRecord = await repositoriesCollection.findOne({ fullName: `${owner}/${repo}` });
  if (!repoRecord) return null;

  const prRecord = await pullRequestsCollection.findOne({
    repositoryId: repoRecord.id,
    number: prNumber
  });
  if (!prRecord) return null;

  const analysisRecord = await analysesCollection
    .find({ pullRequestId: prRecord.id })
    .sort({ createdAt: -1 })
    .limit(1)
    .next();

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

export async function getUserAnalysesList(userIdOrLimit?: string | number, optionalLimit = 20) {
  let userId: string | undefined;
  let limit = 20;

  if (typeof userIdOrLimit === "number") {
    limit = userIdOrLimit;
  } else if (typeof userIdOrLimit === "string") {
    userId = userIdOrLimit;
    limit = optionalLimit;
  }

  const analysesCollection = await getAnalysesCollection();

  const pipeline: any[] = [];

  if (userId) {
    pipeline.push({ $match: { userId } });
  }

  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "pull_requests",
        localField: "pullRequestId",
        foreignField: "id",
        as: "pullRequest"
      }
    },
    { $unwind: "$pullRequest" },
    {
      $lookup: {
        from: "repositories",
        localField: "repositoryId",
        foreignField: "id",
        as: "repository"
      }
    },
    { $unwind: "$repository" }
  );

  const results = await analysesCollection.aggregate(pipeline).toArray();

  return results.map((item: any) => ({
    id: item.id,
    repository: {
      fullName: item.repository.fullName,
      name: item.repository.name
    },
    pullRequest: {
      number: item.pullRequest.number,
      title: item.pullRequest.title,
      state: item.pullRequest.state,
      authorLogin: item.pullRequest.authorLogin
    },
    risk: {
      level: (item.riskLevel as "low" | "medium" | "high" | "critical") || "low",
      score: item.riskScore,
      reasons: (item.metadata as { riskReasons?: string[] })?.riskReasons ?? []
    },
    summary: item.summary ?? "",
    breakingChangesCount:
      item.breakingChanges?.items?.length ?? (item.breakingChangeDetected ? 1 : 0),
    testGapsCount: item.testGaps?.length ?? 0,
    analyzedAt: (item.createdAt instanceof Date
      ? item.createdAt
      : new Date(item.createdAt)
    ).toISOString()
  }));
}

export async function getUserReleaseNotesList(userIdOrLimit?: string | number, optionalLimit = 30) {
  let userId: string | undefined;
  let limit = 30;

  if (typeof userIdOrLimit === "number") {
    limit = userIdOrLimit;
  } else if (typeof userIdOrLimit === "string") {
    userId = userIdOrLimit;
    limit = optionalLimit;
  }

  const releaseNotesCollection = await getReleaseNotesCollection();

  const pipeline: any[] = [
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "analyses",
        localField: "analysisId",
        foreignField: "id",
        as: "analysis"
      }
    },
    { $unwind: "$analysis" }
  ];

  if (userId) {
    pipeline.push({ $match: { "analysis.userId": userId } });
  }

  pipeline.push(
    { $limit: limit },
    {
      $lookup: {
        from: "repositories",
        localField: "repositoryId",
        foreignField: "id",
        as: "repository"
      }
    },
    { $unwind: "$repository" },
    {
      $lookup: {
        from: "pull_requests",
        localField: "analysis.pullRequestId",
        foreignField: "id",
        as: "pullRequest"
      }
    },
    { $unwind: "$pullRequest" }
  );

  const results = await releaseNotesCollection.aggregate(pipeline).toArray();

  return results.map((item: any) => ({
    id: item.id,
    repositoryName: item.repository.fullName,
    prNumber: item.pullRequest.number,
    prTitle: item.pullRequest.title,
    summary: item.analysis.summary ?? "",
    releaseNotes: item.body,
    type: item.type,
    createdAt: (item.createdAt instanceof Date
      ? item.createdAt
      : new Date(item.createdAt)
    ).toISOString()
  }));
}

export async function getDashboardStats(userId?: string) {
  const repositoriesCollection = await getRepositoriesCollection();
  const pullRequestsCollection = await getPullRequestsCollection();
  const analysesCollection = await getAnalysesCollection();

  if (userId) {
    const userRepos = await repositoriesCollection.find({ ownerId: userId }).toArray();
    const userRepoIds = userRepos.map((r) => r.id);

    // Count distinct repositories analyzed by this user
    const analyzedRepoIds = await analysesCollection.distinct("repositoryId", { userId });
    const repositoriesCount = Math.max(userRepoIds.length, analyzedRepoIds.length);

    // Count open PRs analyzed by this user
    const openPrsPipeline = [
      { $match: { userId } },
      {
        $lookup: {
          from: "pull_requests",
          localField: "pullRequestId",
          foreignField: "id",
          as: "pr"
        }
      },
      { $unwind: "$pr" },
      { $match: { "pr.state": "open" } },
      { $group: { _id: "$pullRequestId" } },
      { $count: "count" }
    ];
    const openPrsResult = await analysesCollection.aggregate(openPrsPipeline).toArray();
    const openPrsCount = openPrsResult[0]?.count ?? 0;

    // Count distinct PRs analyzed by this user
    const distinctAnalyzedPrs = await analysesCollection.distinct("pullRequestId", { userId });
    const analyzedPrsCount = distinctAnalyzedPrs.length;

    // Count high and critical risk analyses
    const highRiskCount = await analysesCollection.countDocuments({
      userId,
      riskLevel: { $in: ["high", "critical"] }
    });

    return {
      repositoriesCount,
      openPrsCount,
      analyzedPrsCount,
      highRiskCount
    };
  }

  // Global fallback (when no specific user ID is passed, e.g. tests)
  const repositoriesCount = await repositoriesCollection.countDocuments();
  const openPrsCount = await pullRequestsCollection.countDocuments({ state: "open" });
  const distinctAnalyzedPrs = await analysesCollection.distinct("pullRequestId");
  const analyzedPrsCount = distinctAnalyzedPrs.length;
  const highRiskCount = await analysesCollection.countDocuments({
    riskLevel: { $in: ["high", "critical"] }
  });

  return {
    repositoriesCount,
    openPrsCount,
    analyzedPrsCount,
    highRiskCount
  };
}
