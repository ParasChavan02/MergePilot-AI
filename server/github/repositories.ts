import { getGitHubClient } from "./client";
import { handleGitHubError } from "./errors";
import type { GitHubRepository } from "./types";

interface GetUserRepositoriesOptions {
  sort?: "updated" | "pushed" | "full_name" | "created";
  direction?: "asc" | "desc";
  perPage?: number;
  page?: number;
  visibility?: "all" | "public" | "private";
  userId?: string;
}

export async function getUserRepositories(
  options: GetUserRepositoriesOptions = {}
): Promise<GitHubRepository[]> {
  try {
    const octokit = await getGitHubClient(options.userId);

    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: options.sort ?? "updated",
      direction: options.direction ?? "desc",
      per_page: Math.min(options.perPage ?? 50, 100),
      page: options.page ?? 1,
      visibility: options.visibility ?? "all",
      affiliation: "owner,collaborator,organization_member"
    });

    return data.map((repo) => normalizeRepository(repo));
  } catch (error) {
    return handleGitHubError(error, "Failed to load GitHub repositories");
  }
}

export async function getRepository(
  owner: string,
  repo: string,
  userId?: string
): Promise<GitHubRepository> {
  try {
    const octokit = await getGitHubClient(userId);

    const { data } = await octokit.rest.repos.get({
      owner,
      repo
    });

    return normalizeRepository(data);
  } catch (error) {
    return handleGitHubError(error, `Failed to load repository ${owner}/${repo}`);
  }
}

export function normalizeRepository(raw: any): GitHubRepository {
  return {
    id: raw.id,
    name: raw.name,
    full_name: raw.full_name,
    owner: {
      login: raw.owner?.login ?? "unknown",
      avatar_url: raw.owner?.avatar_url ?? "",
      html_url: raw.owner?.html_url ?? ""
    },
    description: raw.description ?? null,
    private: Boolean(raw.private),
    html_url: raw.html_url,
    default_branch: raw.default_branch ?? "main",
    language: raw.language ?? null,
    stargazers_count: raw.stargazers_count ?? 0,
    forks_count: raw.forks_count ?? 0,
    open_issues_count: raw.open_issues_count ?? 0,
    updated_at: raw.updated_at ?? new Date().toISOString(),
    pushed_at: raw.pushed_at ?? null,
    is_fork: Boolean(raw.fork)
  };
}
