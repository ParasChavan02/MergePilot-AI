import { describe, expect, it } from "vitest";

import type { PullRequestContext } from "@/server/github/types";
import { evaluateDeterministicRisk, synthesizeRisk } from "@/server/risk/engine";

describe("Deterministic Risk Engine", () => {
  const baseContext: PullRequestContext = {
    repository: {
      owner: "ParasChavan02",
      repo: "MergePilot-AI",
      fullName: "ParasChavan02/MergePilot-AI",
      defaultBranch: "main",
      private: true,
      description: "PR intelligence platform",
      htmlUrl: "https://github.com/ParasChavan02/MergePilot-AI"
    },
    pullRequest: {
      id: 1,
      number: 100,
      title: "Test PR",
      body: "Test description",
      state: "open",
      draft: false,
      author: {
        login: "Paras",
        avatar_url: "",
        html_url: ""
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      merged_at: null,
      closed_at: null,
      html_url: "",
      additions: 50,
      deletions: 10,
      changed_files: 2,
      commits: 1,
      head: { ref: "feature", sha: "111" },
      base: { ref: "main", sha: "222" }
    },
    description: "Test description",
    changedFiles: [],
    commits: [],
    reviews: [],
    comments: [],
    statistics: {
      totalAdditions: 50,
      totalDeletions: 10,
      totalChangedFiles: 2,
      totalCommits: 1
    },
    contextTruncated: false
  };

  it("detects high risk for authentication and session modifications without tests", () => {
    const authContext: PullRequestContext = {
      ...baseContext,
      changedFiles: [
        {
          sha: "123",
          filename: "server/auth/session.ts",
          status: "modified",
          additions: 120,
          deletions: 30,
          changes: 150,
          patch: "@@ -1,5 +1,10 @@\n+ export function refreshSessionToken() {}"
        }
      ]
    };

    const assessment = evaluateDeterministicRisk(authContext);

    expect(assessment.score).toBeGreaterThanOrEqual(50);
    expect(["high", "critical"]).toContain(assessment.level);
    expect(assessment.hasTests).toBe(false);
    expect(assessment.signals.some((s) => s.category === "auth")).toBe(true);
    expect(assessment.signals.some((s) => s.category === "test_gap")).toBe(true);
  });

  it("flags destructive database statements with critical severity", () => {
    const dbContext: PullRequestContext = {
      ...baseContext,
      changedFiles: [
        {
          sha: "456",
          filename: "drizzle/migrations/0002_drop.sql",
          status: "added",
          additions: 10,
          deletions: 0,
          changes: 10,
          patch: "ALTER TABLE users DROP COLUMN legacy_token CASCADE;"
        }
      ]
    };

    const assessment = evaluateDeterministicRisk(dbContext);

    expect(assessment.level).toBe("critical");
    expect(assessment.signals.some((s) => s.title.includes("destructive"))).toBe(true);
  });

  it("assigns low risk to documentation-only pull requests", () => {
    const docsContext: PullRequestContext = {
      ...baseContext,
      changedFiles: [
        {
          sha: "789",
          filename: "README.md",
          status: "modified",
          additions: 25,
          deletions: 5,
          changes: 30
        },
        {
          sha: "790",
          filename: "docs/architecture.md",
          status: "added",
          additions: 100,
          deletions: 0,
          changes: 100
        }
      ]
    };

    const assessment = evaluateDeterministicRisk(docsContext);

    expect(assessment.level).toBe("low");
    expect(assessment.score).toBeLessThanOrEqual(20);
  });

  it("synthesizes deterministic signals with AI reasoning properly", () => {
    const deterministic = {
      score: 75,
      level: "high" as const,
      signals: [],
      hasTests: false,
      isLargePR: false,
      reasons: ["Authentication middleware modified"]
    };

    const aiRisk = {
      level: "high" as const,
      score: 85,
      reasons: ["Session token refresh logic lacks automated tests"]
    };

    const synthesized = synthesizeRisk(deterministic, aiRisk);

    expect(synthesized.score).toBeGreaterThanOrEqual(75);
    expect(synthesized.level).toBe("high");
    expect(synthesized.reasons).toContain("Authentication middleware modified");
    expect(synthesized.reasons).toContain("Session token refresh logic lacks automated tests");
  });
});
