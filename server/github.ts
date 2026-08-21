import { Octokit } from "@octokit/rest";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

async function getGitHubAccessToken() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const account = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, session.user.id),
      eq(accounts.provider, "github")
    )
  });

  if (!account?.access_token) {
    throw new Error("GitHub account is not connected");
  }

  return account.access_token;
}

export async function getGitHubClient() {
  const accessToken = await getGitHubAccessToken();

  return new Octokit({
    auth: accessToken
  });
}