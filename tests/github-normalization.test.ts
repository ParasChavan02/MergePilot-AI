import { describe, expect, it, vi } from "vitest";

vi.mock("@/server/auth", () => ({
  auth: vi.fn()
}));

import {
  GitHubConnectionError,
  GitHubForbiddenError,
  GitHubNotFoundError,
  GitHubRateLimitError,
  handleGitHubError
} from "@/server/github/errors";
import { normalizePullRequest } from "@/server/github/pull-requests";
import { normalizeRepository } from "@/server/github/repositories";

describe("GitHub API Normalization", () => {
  it("normalizes raw GitHub repository data correctly", () => {
    const rawRepo = {
      id: 123456,
      name: "MergePilot-AI",
      full_name: "ParasChavan02/MergePilot-AI",
      owner: {
        login: "ParasChavan02",
        avatar_url: "https://avatars.githubusercontent.com/u/12345",
        html_url: "https://github.com/ParasChavan02"
      },
      description: "AI-powered pull request intelligence",
      private: true,
      html_url: "https://github.com/ParasChavan02/MergePilot-AI",
      default_branch: "main",
      language: "TypeScript",
      stargazers_count: 42,
      forks_count: 5,
      open_issues_count: 3,
      updated_at: "2026-10-01T12:00:00Z",
      pushed_at: "2026-10-01T14:30:00Z",
      fork: false
    };

    const normalized = normalizeRepository(rawRepo);

    expect(normalized.id).toBe(123456);
    expect(normalized.name).toBe("MergePilot-AI");
    expect(normalized.full_name).toBe("ParasChavan02/MergePilot-AI");
    expect(normalized.owner.login).toBe("ParasChavan02");
    expect(normalized.private).toBe(true);
    expect(normalized.language).toBe("TypeScript");
    expect(normalized.stargazers_count).toBe(42);
    expect(normalized.is_fork).toBe(false);
  });

  it("normalizes raw GitHub pull request data including merged state", () => {
    const rawPR = {
      id: 98765,
      number: 124,
      title: "Improve authentication middleware",
      body: "Refactors auth tokens to JWT",
      state: "closed",
      draft: false,
      user: {
        login: "Paras",
        avatar_url: "https://avatars.githubusercontent.com/u/999",
        html_url: "https://github.com/Paras"
      },
      created_at: "2026-10-02T10:00:00Z",
      updated_at: "2026-10-02T11:00:00Z",
      merged_at: "2026-10-02T11:00:00Z",
      closed_at: "2026-10-02T11:00:00Z",
      html_url: "https://github.com/ParasChavan02/MergePilot-AI/pull/124",
      additions: 342,
      deletions: 87,
      changed_files: 12,
      commits: 4,
      head: { ref: "fix/auth", sha: "abc1234" },
      base: { ref: "main", sha: "def5678" }
    };

    const normalized = normalizePullRequest(rawPR);

    expect(normalized.number).toBe(124);
    expect(normalized.title).toBe("Improve authentication middleware");
    expect(normalized.state).toBe("merged");
    expect(normalized.author.login).toBe("Paras");
    expect(normalized.additions).toBe(342);
    expect(normalized.deletions).toBe(87);
    expect(normalized.changed_files).toBe(12);
  });
});

describe("GitHub Error Handling", () => {
  it("maps 401 status to GitHubConnectionError", () => {
    expect(() => {
      handleGitHubError({ status: 401, message: "Bad credentials" });
    }).toThrow(GitHubConnectionError);
  });

  it("maps 403 rate limit to GitHubRateLimitError", () => {
    expect(() => {
      handleGitHubError({
        status: 403,
        message: "API rate limit exceeded for user ID"
      });
    }).toThrow(GitHubRateLimitError);
  });

  it("maps 403 forbidden to GitHubForbiddenError", () => {
    expect(() => {
      handleGitHubError({ status: 403, message: "Must have push access" });
    }).toThrow(GitHubForbiddenError);
  });

  it("maps 404 not found to GitHubNotFoundError", () => {
    expect(() => {
      handleGitHubError({ status: 404, message: "Not Found" });
    }).toThrow(GitHubNotFoundError);
  });
});
