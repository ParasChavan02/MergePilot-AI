import { NextResponse } from "next/server";

import { getGitHubClient } from "@/server/github";

export async function GET() {
  try {
    const octokit = await getGitHubClient();

    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      visibility: "all",
      affiliation: "owner,collaborator,organization_member",
      sort: "updated",
      per_page: 50
    });

    return NextResponse.json({
      repositories: data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        owner: repo.owner.login,
        private: repo.private,
        defaultBranch: repo.default_branch,
        description: repo.description,
        htmlUrl: repo.html_url
      }))
    });
  } catch (error) {
    console.error("GitHub repositories error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch GitHub repositories"
      },
      {
        status: 500
      }
    );
  }
}