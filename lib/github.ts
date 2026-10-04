import { auth } from "@/server/auth";

const GITHUB_API = "https://api.github.com";

async function getAccessToken() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // We will add GitHub token retrieval here next.
  return null;
}

export async function githubFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("GitHub access token not available");
  }

  const response = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
