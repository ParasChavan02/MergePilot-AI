import { Octokit } from "@octokit/rest";
import { and, eq } from "drizzle-orm";

import { GitHubConnectionError, UnauthorizedError } from "./errors";

import { accounts } from "@/db/schema";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

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

  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, targetUserId), eq(accounts.provider, "github"))
  });

  if (account?.access_token) {
    return account.access_token;
  }

  // Fallback: If not in accounts table, check active session's JWT token
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
    // Backfill token into accounts table so future DB lookups succeed
    try {
      await db
        .update(accounts)
        .set({ access_token: sessionToken })
        .where(and(eq(accounts.userId, targetUserId), eq(accounts.provider, "github")));
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
