export class GitHubServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly code: string = "GITHUB_SERVICE_ERROR"
  ) {
    super(message);
    this.name = "GitHubServiceError";
  }
}

export class UnauthorizedError extends GitHubServiceError {
  constructor(message = "Unauthorized: Please sign in to continue") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class GitHubConnectionError extends GitHubServiceError {
  constructor(message = "Your GitHub connection is missing or has expired. Please sign in again.") {
    super(message, 401, "GITHUB_CONNECTION_EXPIRED");
    this.name = "GitHubConnectionError";
  }
}

export class GitHubRateLimitError extends GitHubServiceError {
  constructor(message = "GitHub API rate limit reached. Please wait a moment and try again.") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "GitHubRateLimitError";
  }
}

export class GitHubNotFoundError extends GitHubServiceError {
  constructor(message = "The requested GitHub resource was not found.") {
    super(message, 404, "NOT_FOUND");
    this.name = "GitHubNotFoundError";
  }
}

export class GitHubForbiddenError extends GitHubServiceError {
  constructor(message = "Access to this GitHub repository or pull request is forbidden.") {
    super(message, 403, "FORBIDDEN");
    this.name = "GitHubForbiddenError";
  }
}

export class GitHubApiError extends GitHubServiceError {
  constructor(message = "GitHub API returned an error.", status = 500) {
    super(message, status, "GITHUB_API_ERROR");
    this.name = "GitHubApiError";
  }
}

export function handleGitHubError(
  error: unknown,
  fallbackMessage = "GitHub request failed"
): never {
  if (error instanceof GitHubServiceError) {
    throw error;
  }

  const err = error as {
    status?: number;
    message?: string;
    response?: { data?: { message?: string } };
  };
  const status = err?.status;
  const message = err?.response?.data?.message ?? err?.message ?? fallbackMessage;

  if (status === 401) {
    throw new GitHubConnectionError(message);
  }

  if (status === 403) {
    if (message.toLowerCase().includes("rate limit")) {
      throw new GitHubRateLimitError(message);
    }
    throw new GitHubForbiddenError(message);
  }

  if (status === 404) {
    throw new GitHubNotFoundError(message);
  }

  if (status === 429) {
    throw new GitHubRateLimitError(message);
  }

  throw new GitHubApiError(message, status ?? 500);
}
