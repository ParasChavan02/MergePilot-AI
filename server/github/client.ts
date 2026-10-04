import { Octokit } from "@octokit/rest";
import { and, eq } from "drizzle-orm";

import { GitHubConnectionError, UnauthorizedError } from "./errors";

import { accounts } from "@/db/schema";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function getGitHubAccessToken(userId?: string): Promise<string> {
  let targetUserId = userId;

  if (!targetUserId) {
    const session = await auth();
    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }
    targetUserId = session.user.id;
  }

  const account = await db.query.accounts.findFirst({
    where: and(eq(accounts.userId, targetUserId), eq(accounts.provider, "github"))
  });

  if (!account?.access_token) {
    throw new GitHubConnectionError();
  }

  return account.access_token;
}

export async function getGitHubClient(userId?: string): Promise<Octokit> {
  const token = await getGitHubAccessToken(userId);

  return new Octokit({
    auth: token,
    userAgent: "MergePilot-AI/1.0"
  });
}
