import { getGitHubClient } from "./client";
import { handleGitHubError } from "./errors";
import type {
  GitHubComment,
  GitHubCommit,
  GitHubFile,
  GitHubPullRequest,
  GitHubReview,
  PullRequestContext
} from "./types";

interface GetPullRequestsOptions {
  state?: "open" | "closed" | "all";
  sort?: "created" | "updated" | "popularity";
  direction?: "asc" | "desc";
  perPage?: number;
  page?: number;
  userId?: string;
}

export async function getRepositoryPullRequests(
  owner: string,
  repo: string,
  options: GetPullRequestsOptions = {}
): Promise<GitHubPullRequest[]> {
  try {
    const octokit = await getGitHubClient(options.userId);

    const { data } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: options.state ?? "open",
      sort: options.sort ?? "updated",
      direction: options.direction ?? "desc",
      per_page: Math.min(options.perPage ?? 30, 100),
      page: options.page ?? 1
    });

    return data.map((pr) => normalizePullRequest(pr));
  } catch (error) {
    return handleGitHubError(error, `Failed to load pull requests for ${owner}/${repo}`);
  }
}

export async function getPullRequestContext(
  owner: string,
  repo: string,
  number: number,
  userId?: string
): Promise<PullRequestContext> {
  try {
    const octokit = await getGitHubClient(userId);

    const [
      { data: repoData },
      { data: prData },
      { data: filesData },
      { data: commitsData },
      { data: reviewsData },
      { data: commentsData }
    ] = await Promise.all([
      octokit.rest.repos.get({ owner, repo }),
      octokit.rest.pulls.get({ owner, repo, pull_number: number }),
      octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: number,
        per_page: 100
      }),
      octokit.rest.pulls.listCommits({
        owner,
        repo,
        pull_number: number,
        per_page: 50
      }),
      octokit.rest.pulls.listReviews({
        owner,
        repo,
        pull_number: number,
        per_page: 30
      }),
      octokit.rest.pulls.listReviewComments({
        owner,
        repo,
        pull_number: number,
        per_page: 50
      })
    ]);

    const normalizedPR = normalizePullRequest(prData);

    const normalizedFiles: GitHubFile[] = filesData.map((f) => ({
      sha: f.sha,
      filename: f.filename,
      status: (f.status as GitHubFile["status"]) ?? "modified",
      additions: f.additions,
      deletions: f.deletions,
      changes: f.changes,
      patch: f.patch,
      previous_filename: f.previous_filename
    }));

    const normalizedCommits: GitHubCommit[] = commitsData.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      author: {
        name: c.commit.author?.name ?? "Unknown",
        email: c.commit.author?.email ?? undefined,
        date: c.commit.author?.date ?? new Date().toISOString(),
        login: c.author?.login,
        avatar_url: c.author?.avatar_url
      },
      html_url: c.html_url
    }));

    const normalizedReviews: GitHubReview[] = reviewsData.map((r) => ({
      id: r.id,
      user: {
        login: r.user?.login ?? "ghost",
        avatar_url: r.user?.avatar_url ?? "",
        html_url: r.user?.html_url ?? ""
      },
      state: r.state,
      submitted_at: r.submitted_at ?? null,
      body: r.body ?? ""
    }));

    const normalizedComments: GitHubComment[] = commentsData.map((c) => ({
      id: c.id,
      user: {
        login: c.user?.login ?? "ghost",
        avatar_url: c.user?.avatar_url ?? "",
        html_url: c.user?.html_url ?? ""
      },
      body: c.body,
      created_at: c.created_at,
      path: c.path,
      line: c.line ?? undefined
    }));

    // Context budgeting: Limit patch sizes for huge PRs to avoid token overflow
    let totalPatchChars = 0;
    const MAX_PATCH_CHARS = 45000;
    let contextTruncated = false;
    let truncationReason: string | undefined;

    const budgetedFiles = normalizedFiles.map((file) => {
      if (!file.patch) return file;

      if (totalPatchChars > MAX_PATCH_CHARS) {
        contextTruncated = true;
        truncationReason =
          "Pull request diff exceeded maximum analysis token budget; prioritized metadata and file list.";
        return {
          ...file,
          patch:
            "[Patch omitted due to large diff size. File metadata and changes count preserved.]"
        };
      }

      if (totalPatchChars + file.patch.length > MAX_PATCH_CHARS) {
        const remainingChars = Math.max(0, MAX_PATCH_CHARS - totalPatchChars);
        totalPatchChars += remainingChars;
        contextTruncated = true;
        truncationReason =
          "Pull request diff was partially truncated to stay within AI analysis window.";
        return {
          ...file,
          patch: `${file.patch.slice(0, remainingChars)}\n... [Diff truncated due to size]`
        };
      }

      totalPatchChars += file.patch.length;
      return file;
    });

    return {
      repository: {
        owner: repoData.owner.login,
        repo: repoData.name,
        fullName: repoData.full_name,
        defaultBranch: repoData.default_branch,
        private: repoData.private,
        description: repoData.description ?? null,
        htmlUrl: repoData.html_url
      },
      pullRequest: normalizedPR,
      description: normalizedPR.body,
      changedFiles: budgetedFiles,
      commits: normalizedCommits,
      reviews: normalizedReviews,
      comments: normalizedComments,
      statistics: {
        totalAdditions: normalizedPR.additions,
        totalDeletions: normalizedPR.deletions,
        totalChangedFiles: normalizedPR.changed_files,
        totalCommits: normalizedPR.commits
      },
      contextTruncated,
      truncationReason
    };
  } catch (error) {
    return handleGitHubError(error, `Failed to load details for ${owner}/${repo}#${number}`);
  }
}

export function normalizePullRequest(raw: any): GitHubPullRequest {
  const isMerged = Boolean(raw.merged_at);
  const state: "open" | "closed" | "merged" = isMerged
    ? "merged"
    : ((raw.state as "open" | "closed") ?? "open");

  return {
    id: raw.id,
    number: raw.number,
    title: raw.title ?? "",
    body: raw.body ?? null,
    state,
    draft: Boolean(raw.draft),
    author: {
      login: raw.user?.login ?? "ghost",
      avatar_url: raw.user?.avatar_url ?? "",
      html_url: raw.user?.html_url ?? ""
    },
    created_at: raw.created_at ?? new Date().toISOString(),
    updated_at: raw.updated_at ?? new Date().toISOString(),
    merged_at: raw.merged_at ?? null,
    closed_at: raw.closed_at ?? null,
    html_url: raw.html_url ?? "",
    additions: raw.additions ?? 0,
    deletions: raw.deletions ?? 0,
    changed_files: raw.changed_files ?? 0,
    commits: raw.commits ?? 0,
    head: {
      ref: raw.head?.ref ?? "unknown",
      sha: raw.head?.sha ?? ""
    },
    base: {
      ref: raw.base?.ref ?? "main",
      sha: raw.base?.sha ?? ""
    }
  };
}
