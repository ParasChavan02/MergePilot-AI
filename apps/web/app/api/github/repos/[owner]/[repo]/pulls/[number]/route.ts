import { NextResponse } from "next/server";

import { getGitHubClient } from "@/server/github";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
    number: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { owner, repo, number } = await params;

    const pullNumber = Number(number);

    if (!Number.isInteger(pullNumber)) {
      return NextResponse.json(
        { error: "Invalid pull request number" },
        { status: 400 }
      );
    }

    const octokit = await getGitHubClient();

    const [{ data: pullRequest }, { data: files }] = await Promise.all([
      octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
      }),

      octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
        per_page: 100
      })
    ]);

    return NextResponse.json({
      pullRequest: {
        number: pullRequest.number,
        title: pullRequest.title,
        body: pullRequest.body,
        author: pullRequest.user?.login ?? null,
        state: pullRequest.state,
        createdAt: pullRequest.created_at,
        updatedAt: pullRequest.updated_at,
        additions: pullRequest.additions,
        deletions: pullRequest.deletions,
        changedFiles: pullRequest.changed_files,
        commits: pullRequest.commits,
        baseBranch: pullRequest.base.ref,
        headBranch: pullRequest.head.ref,
        htmlUrl: pullRequest.html_url
      },

      files: files.map((file) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch ?? null
      }))
    });
  } catch (error) {
    console.error("GitHub PR details error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch pull request details"
      },
      {
        status: 500
      }
    );
  }
}