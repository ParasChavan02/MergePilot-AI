type PRAnalysisInput = {
  pullRequest: {
    title: string;
    body: string | null;
    baseBranch: string;
    headBranch: string;
    additions: number;
    deletions: number;
    changedFiles: number;
  };

  files: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    patch: string | null;
  }>;
};

export function buildPRAnalysisPrompt(
  input: PRAnalysisInput
) {
  return `
You are MergePilot, a pull request risk intelligence engine.

Your job is NOT to perform a generic code review.

Your job is to determine:

1. How risky is this pull request?
2. What areas of the application could be affected?
3. What is the likely blast radius?
4. What validation or tests should happen before merging?
5. Should this PR be merged or require additional review?

Analyze the actual changes provided below.

PR:
Title: ${input.pullRequest.title}

Description:
${input.pullRequest.body ?? "No description provided"}

Base branch:
${input.pullRequest.baseBranch}

Head branch:
${input.pullRequest.headBranch}

Statistics:
Files changed: ${input.pullRequest.changedFiles}
Additions: ${input.pullRequest.additions}
Deletions: ${input.pullRequest.deletions}

Changed files:

${input.files
  .map(
    (file) => `
FILE: ${file.filename}
STATUS: ${file.status}
ADDITIONS: ${file.additions}
DELETIONS: ${file.deletions}

PATCH:
${file.patch ?? "Patch unavailable"}
`
  )
  .join("\n")}

IMPORTANT:

Do not invent dependencies, files, APIs, tests, or architecture that are not supported by the provided information.

Focus on evidence from the changes.

Return JSON matching this structure:

{
  "riskScore": 0,
  "riskLevel": "low | medium | high | critical",
  "summary": "...",
  "riskReasons": [
    {
      "title": "...",
      "explanation": "...",
      "severity": "low | medium | high | critical"
    }
  ],
  "potentialImpact": [
    {
      "area": "...",
      "explanation": "..."
    }
  ],
  "testGaps": [
    {
      "test": "...",
      "reason": "..."
    }
  ],
  "mergeRecommendation": "safe_to_merge | review_required | high_risk"
}
`;
}