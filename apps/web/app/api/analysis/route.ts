import { NextResponse } from "next/server";

import { getGitHubClient } from "@/server/github";
import { analyzeWithGemini } from "@/server/gemini";
import { buildPRAnalysisPrompt } from "@/lib/prompts/pr-analysis";
import { analysisSchema } from "@/server/analysis";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const owner = String(body.owner);
    const repo = String(body.repo);
    const number = Number(body.number);

    if (!owner || !repo || !Number.isInteger(number)) {
      return NextResponse.json(
        { error: "Invalid repository or pull request" },
        { status: 400 }
      );
    }

    const octokit = await getGitHubClient();

    const [{ data: pullRequest }, { data: files }] =
      await Promise.all([
        octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: number
        }),

        octokit.rest.pulls.listFiles({
          owner,
          repo,
          pull_number: number,
          per_page: 100
        })
      ]);

    const prompt = buildPRAnalysisPrompt({
      pullRequest: {
        title: pullRequest.title,
        body: pullRequest.body,
        baseBranch: pullRequest.base.ref,
        headBranch: pullRequest.head.ref,
        additions: pullRequest.additions,
        deletions: pullRequest.deletions,
        changedFiles: pullRequest.changed_files
      },

      files: files.map((file) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        patch: file.patch ?? null
      }))
    });

    const rawAnalysis = await analyzeWithGemini(prompt);

    const parsedAnalysis = analysisSchema.parse(
      JSON.parse(rawAnalysis)
    );

    return NextResponse.json({
      pullRequest: {
        number: pullRequest.number,
        title: pullRequest.title,
        htmlUrl: pullRequest.html_url
      },

      analysis: parsedAnalysis
    });
  } catch (error) {
    console.error("PR analysis error:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze pull request"
      },
      {
        status: 500
      }
    );
  }
}