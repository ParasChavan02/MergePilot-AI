export interface GitHubRepositoryOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: GitHubRepositoryOwner;
  description: string | null;
  private: boolean;
  html_url: string;
  default_branch: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  pushed_at: string | null;
  is_fork: boolean;
}

export interface GitHubAuthor {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed" | "merged";
  draft: boolean;
  author: GitHubAuthor;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  closed_at: string | null;
  html_url: string;
  additions: number;
  deletions: number;
  changed_files: number;
  commits: number;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  analysis?:
    | {
        id: string;
        riskLevel: "low" | "medium" | "high" | "critical";
        riskScore: number;
        analyzedAt: string;
      }
    | null
    | undefined;
}

export interface GitHubFile {
  sha: string | null;
  filename: string;
  status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string | undefined;
  previous_filename?: string | undefined;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email?: string | undefined;
    date: string;
    login?: string | undefined;
    avatar_url?: string | undefined;
  };
  html_url: string;
}

export interface GitHubReview {
  id: number;
  user: GitHubAuthor;
  state: string;
  submitted_at: string | null;
  body: string;
}

export interface GitHubComment {
  id: number;
  user: GitHubAuthor;
  body: string;
  created_at: string;
  path?: string | undefined;
  line?: number | undefined;
}

export interface PullRequestContext {
  repository: {
    owner: string;
    repo: string;
    fullName: string;
    defaultBranch: string;
    private: boolean;
    description: string | null;
    htmlUrl: string;
  };
  pullRequest: GitHubPullRequest;
  description: string | null;
  changedFiles: GitHubFile[];
  commits: GitHubCommit[];
  reviews: GitHubReview[];
  comments: GitHubComment[];
  statistics: {
    totalAdditions: number;
    totalDeletions: number;
    totalChangedFiles: number;
    totalCommits: number;
  };
  contextTruncated: boolean;
  truncationReason?: string | undefined;
}
