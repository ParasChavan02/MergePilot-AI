import { Octokit } from "@octokit/rest";

import { GitHubConnectionError, UnauthorizedError } from "./errors";

import { auth } from "@/server/auth";
import { getAccountsCollection } from "@/server/db";

export async function getGitHubAccessToken(userId?: string): Promise<string> {
  let targetUserId = userId;
  let sessionToken: string | undefined;

  if (!targetUserId) {
    const session = await auth();
    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }
    targetUserId = session.user.id;
    sessionToken = session.accessToken;
  }

  const accountsCollection = await getAccountsCollection();
  const account = await accountsCollection.findOne({
    userId: targetUserId,
    provider: "github"
  });

  if (account?.access_token) {
    return account.access_token;
  }

  // Fallback: If not in accounts collection, check active session's JWT token
  if (!sessionToken) {
    try {
      const session = await auth();
      if (session?.user?.id === targetUserId && session.accessToken) {
        sessionToken = session.accessToken;
      }
    } catch {
      // Ignore session lookup error
    }
  }

  if (sessionToken) {
    // Backfill token into accounts collection so future lookups succeed
    try {
      await accountsCollection.updateOne(
        { userId: targetUserId, provider: "github" },
        { $set: { access_token: sessionToken } }
      );
    } catch {
      // Ignore backfill failure
    }
    return sessionToken;
  }

  throw new GitHubConnectionError();
}

export async function getGitHubClient(userId?: string): Promise<Octokit> {
  const token = await getGitHubAccessToken(userId);

  return new Octokit({
    auth: token,
    userAgent: "MergePilot-AI/1.0"
  });
}
