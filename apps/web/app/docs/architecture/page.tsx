import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Architecture",
  description: "Explore the technical architecture, data flow, and services powering MergePilot AI."
};

const tocItems: TocItem[] = [
  { title: "System Architecture", id: "system-architecture" },
  { title: "Architecture Diagram", id: "diagram" },
  { title: "Technology Stack", id: "tech-stack" },
  { title: "Authentication & Token Security", id: "auth-layer" },
  { title: "GitHub Integration Layer", id: "github-layer" },
  { title: "Deterministic Risk Engine", id: "risk-engine" },
  { title: "Gemini 2.5 Flash Pipeline", id: "ai-pipeline" },
  { title: "Database & Relational Model", id: "database-model" }
];

export default function ArchitecturePage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Architecture & Setup
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            System Architecture
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Detailed engineering breakdown of MergePilot&apos;s modular Next.js App Router services,
            database schema, GitHub integration layer, and AI analysis pipeline.
          </p>
        </div>

        {/* Architecture Diagram */}
        <section id="diagram" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Architecture Diagram
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot is built as a modular monolithic SaaS platform with strict separation of
            concerns across authentication, GitHub API services, deterministic static analysis, and
            LLM reasoning:
          </p>

          <div className="scrollbar-thin overflow-x-auto rounded-xl border border-border bg-[#F5F5F5] p-3.5 font-mono text-[11px] text-foreground dark:bg-[#111111] sm:p-5 sm:text-xs">
            <pre className="leading-relaxed">
              {`┌────────────────────────────────────────────────────────────────────────┐
│                          Client Web Application                        │
│             Next.js 15 App Router • Server Components • React 19       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API Routes & Auth Layer                         │
│       • /api/github/*               • /api/analysis/*                  │
│       • Auth.js v5 (JWT Strategy)   • GitHub OAuth Scope (repo)        │
└───────────────┬───────────────────┬──────────────────┬─────────────────┘
                │                   │                  │
                ▼                   ▼                  ▼
┌───────────────────────┐ ┌──────────────────┐ ┌─────────────────────────┐
│ GitHub Service Layer  │ │  PostgreSQL DB   │ │ Deterministic Engine    │
│ • Octokit REST Client │ │  • Drizzle ORM   │ │ • Regex Pattern Rules   │
│ • Token Resolution    │ │  • Relations     │ │ • Destructive SQL Check │
│ • 45K Patch Budgeting │ │  • JSONB Columns │ │ • Missing Test Detector │
└───────────────┬───────┘ └─────────┬────────┘ └───────────┬─────────────┘
                │                   │                      │
                └─────────────┐     │     ┌────────────────┘
                              ▼     ▼     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       AI Pull Request Pipeline                         │
│  • Google Gemini 2.5 Flash (@google/genai)                             │
│  • Guaranteed JSON Mode (responseMimeType: "application/json")         │
│  • Zod Schema Validation & Guardrails                                  │
│  • Calibrated Risk Synthesis (45% Deterministic + 55% AI)              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Storage & Dashboard View                        │
│       • Persisted Analyses Record   • Release Notes Draft              │
│       • Unified Risk Scorecard      • Real-time Client Dashboard       │
└────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </section>

        {/* Technology Stack */}
        <section id="tech-stack" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Technology Stack</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Framework & Runtime
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Next.js 15 App Router running on Node.js with React 19, Turbopack, and Tailwind CSS.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Database & ORM
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                PostgreSQL database hosted on Neon/Render, mapped with Drizzle ORM type-safe schemas
                and relations.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Authentication
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Auth.js v5 (NextAuth) with GitHub OAuth provider, stateless JWT session strategy,
                and Drizzle adapter.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                AI & Static Analysis
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Google Gemini 2.5 Flash via <code>@google/genai</code> combined with an in-process
                TypeScript deterministic rule engine.
              </p>
            </div>
          </div>
        </section>

        {/* Authentication & Token Security */}
        <section id="auth-layer" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Authentication & Token Security
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Authentication is managed in <code>server/auth.ts</code> using NextAuth with the GitHub
            provider:
          </p>

          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong>JWT Strategy:</strong> Sessions are stored in signed, HTTP-only JWT cookies to
              maintain stateless API route scalability.
            </li>
            <li>
              <strong>Token Persistence:</strong> When the user logs in via GitHub OAuth, Auth.js
              passes the GitHub <code>access_token</code> to the Drizzle adapter, which securely
              stores it in the PostgreSQL <code>accounts</code> table.
            </li>
            <li>
              <strong>Per-Request Client:</strong> When an API route calls the GitHub API,{" "}
              <code>getGitHubAccessToken(userId)</code> reads the user&apos;s token from the
              database, preventing token leakage into browser client components.
            </li>
          </ul>
        </section>

        {/* GitHub Integration Layer */}
        <section id="github-layer" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            GitHub Integration Layer
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Located in <code>server/github/</code>, this layer normalizes GitHub REST responses into
            typed domain entities:
          </p>

          <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">Rate Limit & Error Mapping:</strong> Converts raw
              Octokit HTTP errors into typed exceptions (<code>GitHubNotFoundError</code>,{" "}
              <code>GitHubRateLimitError</code>, <code>GitHubForbiddenError</code>).
            </li>
            <li>
              <strong className="text-foreground">Parallel Data Aggregation:</strong> Executes{" "}
              <code>Promise.all</code> requests across repository info, pull request details, file
              diffs, commits, reviews, and review comments.
            </li>
            <li>
              <strong className="text-foreground">Diff Budgeting (45K chars):</strong> Caps diff
              sizes to protect against LLM context degradation. Excess patches are omitted while
              preserving file metadata and line counts.
            </li>
          </ul>
        </section>

        {/* Deterministic Risk Engine */}
        <section id="risk-engine" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Deterministic Risk Engine
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The deterministic engine (<code>server/risk/engine.ts</code>) operates entirely locally
            in memory. It scores pull requests on structural code signals (regex pattern matching on
            file paths, destructive SQL keywords, PR line size, and test file presence).
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            It establishes an immutable baseline and safety floor that prevents critical code
            modifications from being misclassified.
          </p>
        </section>

        {/* Gemini 2.5 Flash Pipeline */}
        <section id="ai-pipeline" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Gemini 2.5 Flash Pipeline
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The AI engine in <code>server/ai/</code> connects to Google Gemini:
          </p>

          <DocsCodeBlock
            language="typescript"
            filename="server/ai/client.ts"
            code={`const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    temperature: 0.2
  }
});`}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Outputs are parsed with Zod and synthesized with deterministic scores using a 45/55
            calibrated weight.
          </p>
        </section>

        {/* Database & Relational Model */}
        <section id="database-model" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Database & Relational Model
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Defined in <code>db/schema.ts</code>, the schema links users, repositories, pull
            requests, analyses, and release notes:
          </p>

          <div className="space-y-1.5 rounded-xl border border-border/80 bg-card p-4 font-mono text-xs text-foreground">
            <div>users (id, email, name, role)</div>
            <div className="pl-4 text-muted-foreground">
              └── accounts (userId, provider, access_token)
            </div>
            <div className="pl-4 text-muted-foreground">
              └── repositories (id, ownerId, githubId, fullName)
            </div>
            <div className="pl-8 text-muted-foreground">
              └── pullRequests (id, repositoryId, githubId, number, state)
            </div>
            <div className="pl-12 text-muted-foreground">
              └── analyses (id, pullRequestId, riskScore, riskLevel, summary, breakingChanges,
              testGaps)
            </div>
            <div className="pl-16 text-muted-foreground">
              └── releaseNotes (id, analysisId, title, body, type)
            </div>
          </div>
        </section>

        <DocsPager currentPath="/docs/architecture" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
