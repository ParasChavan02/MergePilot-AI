import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "API Reference",
  description:
    "Reference documentation for all implemented MergePilot REST API routes and payloads."
};

const tocItems: TocItem[] = [
  { title: "Overview & Auth", id: "overview" },
  { title: "GET /api/analysis", id: "get-analysis" },
  { title: "POST /api/analysis", id: "post-analysis" },
  { title: "GET /api/github/repos", id: "get-repos" },
  { title: "GET /api/github/repos/.../pulls", id: "get-pulls" },
  { title: "GET /api/github/repos/.../pulls/[number]", id: "get-pull-detail" },
  { title: "POST /api/github/repos/.../analyze", id: "post-pr-analyze" },
  { title: "GET /api/github/repos/.../analysis", id: "get-pr-stored-analysis" },
  { title: "GET /api/release-notes", id: "get-release-notes" }
];

export default function ApiReferencePage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Reference
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            API Reference
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Complete technical documentation for all production REST API endpoints implemented in
            MergePilot AI.
          </p>
        </div>

        {/* Overview & Auth */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Overview & Authentication
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            All API endpoints return JSON payloads and require an active session authenticated via
            NextAuth JWT cookies.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Unauthenticated requests return an HTTP <code>401 Unauthorized</code> response:
          </p>

          <DocsCodeBlock
            language="json"
            code={`{
  "error": "Unauthorized: Please sign in to continue",
  "code": "UNAUTHORIZED"
}`}
          />
        </section>

        {/* GET /api/analysis */}
        <section id="get-analysis" className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              GET
            </span>
            <code className="font-mono text-sm font-semibold text-foreground">/api/analysis</code>
          </div>

          <p className="text-xs text-muted-foreground">
            Retrieves recent historical pull request analyses along with aggregate dashboard
            statistics (total repositories, open PRs, analyzed PRs, and high-risk count).
          </p>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div>
              <strong className="text-foreground">Authentication:</strong> Required (Session JWT)
            </div>
            <div>
              <strong className="text-foreground">Query Parameters:</strong> <code>limit</code>{" "}
              (optional, integer, default: 20)
            </div>
          </div>

          <DocsCodeBlock
            language="json"
            code={`{
  "analyses": [
    {
      "id": "uuid",
      "repository": { "fullName": "owner/repo", "name": "repo" },
      "pullRequest": { "number": 42, "title": "Refactor auth", "state": "open", "authorLogin": "octocat" },
      "risk": { "level": "medium", "score": 52, "reasons": ["Modified session handling"] },
      "summary": "Engineering summary paragraph...",
      "breakingChangesCount": 0,
      "testGapsCount": 1,
      "analyzedAt": "2026-10-04T12:00:00.000Z"
    }
  ],
  "stats": {
    "repositoriesCount": 12,
    "openPrsCount": 8,
    "analyzedPrsCount": 24,
    "highRiskCount": 3
  }
}`}
          />
        </section>

        {/* POST /api/analysis */}
        <section id="post-analysis" className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              POST
            </span>
            <code className="font-mono text-sm font-semibold text-foreground">/api/analysis</code>
          </div>

          <p className="text-xs text-muted-foreground">
            Executes full intelligence analysis on a pull request given its repository owner, name,
            and pull request number.
          </p>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div>
              <strong className="text-foreground">Authentication:</strong> Required (Session JWT)
            </div>
            <div>
              <strong className="text-foreground">Request Body (JSON):</strong>
            </div>
          </div>

          <DocsCodeBlock
            language="json"
            code={`{
  "owner": "facebook",
  "repo": "react",
  "number": 28000
}`}
          />
        </section>

        {/* GET /api/github/repos */}
        <section id="get-repos" className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              GET
            </span>
            <code className="font-mono text-sm font-semibold text-foreground">
              /api/github/repos
            </code>
          </div>

          <p className="text-xs text-muted-foreground">
            Returns repositories accessible to the authenticated GitHub user via Octokit.
          </p>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div>
              <strong className="text-foreground">Query Parameters:</strong> <code>sort</code> (
              <code>updated</code> | <code>pushed</code> | <code>full_name</code>),{" "}
              <code>page</code> (integer), <code>per_page</code> (integer, max 100)
            </div>
          </div>

          <DocsCodeBlock
            language="json"
            code={`{
  "repositories": [
    {
      "id": 12345678,
      "name": "mergepilot-ai",
      "full_name": "ParasChavan02/MergePilot-AI",
      "private": false,
      "html_url": "https://github.com/ParasChavan02/MergePilot-AI",
      "description": "AI-powered GitHub PR intelligence platform",
      "default_branch": "main",
      "language": "TypeScript",
      "open_issues_count": 4,
      "updated_at": "2026-10-04T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1
}`}
          />
        </section>

        {/* GET /api/github/repos/.../pulls */}
        <section id="get-pulls" className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              GET
            </span>
            <code className="font-mono text-sm font-semibold text-foreground">
              /api/github/repos/[owner]/[repo]/pulls
            </code>
          </div>

          <p className="text-xs text-muted-foreground">
            Lists pull requests for a given repository, cross-referenced with any existing database
            analysis records.
          </p>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div>
              <strong className="text-foreground">Path Parameters:</strong> <code>owner</code>{" "}
              (string), <code>repo</code> (string)
            </div>
            <div>
              <strong className="text-foreground">Query Parameters:</strong> <code>state</code> (
              <code>open</code> | <code>closed</code> | <code>all</code>), <code>page</code>,{" "}
              <code>per_page</code>
            </div>
          </div>
        </section>

        {/* GET /api/github/repos/.../pulls/[number] */}
        <section id="get-pull-detail" className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              GET
            </span>
            <code className="font-mono text-sm font-semibold text-foreground">
              /api/github/repos/[owner]/[repo]/pulls/[number]
            </code>
          </div>

          <p className="text-xs text-muted-foreground">
            Fetches comprehensive normalized PR context (metadata, commits, changed files with 45K
            diff budgeting, reviews) along with any stored analysis record.
          </p>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div>
              <strong className="text-foreground">Path Parameters:</strong> <code>owner</code>,{" "}
              <code>repo</code>, <code>number</code>
            </div>
          </div>
        </section>

        {/* POST /api/github/repos/.../analyze */}
        <section id="post-pr-analyze" className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              POST
            </span>
            <code className="font-mono text-sm font-semibold text-foreground">
              /api/github/repos/[owner]/[repo]/pulls/[number]/analyze
            </code>
          </div>

          <p className="text-xs text-muted-foreground">
            Triggers analysis for the specific pull request, computes calibrated risk, executes
            Gemini 2.5 Flash, upserts repository/PR records, and persists the analysis and release
            note draft.
          </p>
        </section>

        {/* GET /api/github/repos/.../analysis */}
        <section id="get-pr-stored-analysis" className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              GET
            </span>
            <code className="font-mono text-sm font-semibold text-foreground">
              /api/github/repos/[owner]/[repo]/pulls/[number]/analysis
            </code>
          </div>

          <p className="text-xs text-muted-foreground">
            Retrieves the cached analysis for a pull request. Returns <code>404 Not Found</code> if
            the PR has not yet been analyzed.
          </p>
        </section>

        {/* GET /api/release-notes */}
        <section id="get-release-notes" className="space-y-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              GET
            </span>
            <code className="font-mono text-sm font-semibold text-foreground">
              /api/release-notes
            </code>
          </div>

          <p className="text-xs text-muted-foreground">
            Returns a feed of generated release note drafts across repositories with PR numbers,
            titles, and classification tags.
          </p>
        </section>

        <DocsPager currentPath="/docs/api" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
