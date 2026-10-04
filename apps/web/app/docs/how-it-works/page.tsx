import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "How It Works",
  description: "Explore the end-to-end pull request intelligence and risk analysis pipeline."
};

const tocItems: TocItem[] = [
  { title: "Pipeline Overview", id: "pipeline-overview" },
  { title: "Stage 1: Authentication & Token Retrieval", id: "stage-1" },
  { title: "Stage 2: Context Retrieval & Budgeting", id: "stage-2" },
  { title: "Stage 3: Deterministic Signal Scanning", id: "stage-3" },
  { title: "Stage 4: Structured Gemini 2.5 Flash Inference", id: "stage-4" },
  { title: "Stage 5: Composite Risk Synthesis", id: "stage-5" },
  { title: "Stage 6: Relational Persistence & Presentation", id: "stage-6" }
];

export default function HowItWorksPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Getting Started
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            How It Works
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            MergePilot combines deterministic static file pattern analysis with Google Gemini 2.5
            Flash reasoning to generate structured pull request intelligence.
          </p>
        </div>

        {/* Pipeline Overview */}
        <section id="pipeline-overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Pipeline Overview
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            When an engineer triggers an analysis on a pull request, MergePilot executes an
            automated 6-stage pipeline:
          </p>

          <div className="scrollbar-thin overflow-x-auto rounded-xl border border-border bg-[#F5F5F5] p-3.5 font-mono text-[11px] text-foreground dark:bg-[#111111] sm:p-5 sm:text-xs">
            <pre className="leading-relaxed">
              {`GitHub Repository
       ↓
GitHub OAuth Session (Token from Accounts Table)
       ↓
Pull Request Metadata + Diff Fetching (Octokit REST)
       ↓
Diff Budgeting & Normalization (45,000 Patch Character Cap)
       ↓
┌────────────────────────────────────────────────────────┐
│               Analysis Execution Engine                │
├──────────────────────────┬─────────────────────────────┤
│ Deterministic Risk Rules │ Gemini 2.5 Flash Inference │
│ • Sensitive file regex   │ • Architectural intent      │
│ • Destructive SQL check  │ • Breaking contract shifts  │
│ • Dependency manifest    │ • Missing test assertions   │
│ • Test file presence     │ • Markdown release note     │
└──────────────────────────┴─────────────────────────────┘
       ↓
Composite Risk Synthesis (45% Deterministic + 55% AI)
       ↓
Zod Schema Validation & Guardrails
       ↓
PostgreSQL Persistence (Drizzle ORM)
       ↓
MergePilot Dashboard View`}
            </pre>
          </div>
        </section>

        {/* Stage 1 */}
        <section id="stage-1" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Stage 1: Authentication & Token Retrieval
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Every operation is scoped to the authenticated user. When a user requests an analysis:
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>Auth.js verifies the JWT session cookie to resolve the user ID.</li>
            <li>
              The server queries the <code>accounts</code> database table for a valid GitHub OAuth
              provider record matching <code>userId</code>.
            </li>
            <li>
              The stored <code>access_token</code> is retrieved to initialize a per-request Octokit
              REST client instance with the user agent <code>MergePilot-AI/1.0</code>.
            </li>
          </ul>
        </section>

        {/* Stage 2 */}
        <section id="stage-2" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Stage 2: Context Retrieval & Budgeting
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The GitHub service concurrently requests repository details, pull request metadata,
            changed file patches (up to 100 files), commit logs (up to 50 commits), and review
            comments using <code>Promise.all</code>:
          </p>

          <DocsCallout type="important" title="Diff Budgeting Guardrail">
            Large pull requests with massive diffs (e.g. lockfiles, generated assets, or build
            artifacts) can quickly exceed LLM context windows or degrade reasoning precision.
            MergePilot enforces a strict budget of <strong>45,000 characters</strong> across all
            file patches. When exceeded, file metadata and addition/deletion counts are preserved,
            but further diff content is gracefully truncated and tagged with{" "}
            <code>contextTruncated = true</code>.
          </DocsCallout>
        </section>

        {/* Stage 3 */}
        <section id="stage-3" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Stage 3: Deterministic Signal Scanning
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Before calling the AI model, MergePilot runs a pure TypeScript deterministic risk engine
            (<code>server/risk/engine.ts</code>) against all changed files and patches:
          </p>

          <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">Authentication & Session Logic:</strong> Matches
              paths containing <code>auth</code>, <code>session</code>, <code>jwt</code>,{" "}
              <code>oauth</code>, <code>login</code>, <code>signup</code>, <code>password</code>, or{" "}
              <code>credential</code> (weight: 35).
            </li>
            <li>
              <strong className="text-foreground">Security Boundaries:</strong> Matches{" "}
              <code>crypto</code>, <code>security</code>, <code>permission</code>, <code>rbac</code>
              , <code>acl</code>, <code>cors</code>, <code>sanitize</code>, or <code>csrf</code>{" "}
              (weight: 35).
            </li>
            <li>
              <strong className="text-foreground">Database Migrations & Schemas:</strong> Matches
              Prisma, Drizzle, SQL, or migration directories (weight: 30).
            </li>
            <li>
              <strong className="text-foreground">Destructive SQL Statements:</strong> Inspects file
              patches for dangerous keywords: <code>DROP TABLE</code>, <code>DROP COLUMN</code>,{" "}
              <code>TRUNCATE</code>, <code>DELETE FROM</code>, or <code>CASCADE</code> (triggers{" "}
              <strong>Critical</strong> severity, weight: 40).
            </li>
            <li>
              <strong className="text-foreground">Payments & Billing:</strong> Matches Stripe,
              payment, billing, checkout, or subscription logic (weight: 35).
            </li>
            <li>
              <strong className="text-foreground">Infrastructure & CI/CD:</strong> Matches Docker,
              Kubernetes, Terraform, or GitHub Actions workflows (weight: 25).
            </li>
            <li>
              <strong className="text-foreground">Dependency Shift:</strong> Matches modifications
              to <code>package.json</code> or lockfiles (weight: 15).
            </li>
            <li>
              <strong className="text-foreground">Large Footprint:</strong> Flags PRs with more than
              600 line changes or 25 files modified (weight: 15).
            </li>
            <li>
              <strong className="text-foreground">Test Absence:</strong> Flags high-severity changes
              that contain no accompanying test files (weight: 20).
            </li>
          </ul>

          <DocsCallout type="tip" title="Documentation Exemption">
            If a pull request contains solely documentation files (<code>.md</code>,{" "}
            <code>.txt</code>, <code>docs/</code>), the engine automatically bypasses heavy scoring
            and assigns a fixed Low risk score of 5.
          </DocsCallout>
        </section>

        {/* Stage 4 */}
        <section id="stage-4" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Stage 4: Structured Gemini 2.5 Flash Inference
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot formats the normalized PR context into an engineering-first prompt and sends
            it to <strong>Google Gemini 2.5 Flash</strong> (<code>@google/genai</code>) configured
            with:
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <code>responseMimeType: &quot;application/json&quot;</code> (Guaranteed JSON output)
            </li>
            <li>
              <code>temperature: 0.2</code> (Low temperature for deterministic, factual reasoning)
            </li>
          </ul>

          <p className="text-xs leading-relaxed text-muted-foreground">
            The raw JSON is parsed and validated using Zod against <code>rawAiAnalysisSchema</code>,
            ensuring required keys (<code>summary</code>, <code>risk</code>, <code>keyChanges</code>
            , <code>breakingChanges</code>, <code>testGaps</code>, <code>recommendations</code>,{" "}
            <code>releaseNotes</code>) match the expected data types.
          </p>
        </section>

        {/* Stage 5 */}
        <section id="stage-5" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Stage 5: Composite Risk Synthesis
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            To prevent AI hallucinations from downplaying critical risks or overstating benign
            changes, the system synthesizes both assessments:
          </p>

          <div className="rounded-xl border border-border/80 bg-card p-4 font-mono text-xs text-foreground">
            <code>blendedScore = Math.round(deterministicScore * 0.45 + aiScore * 0.55)</code>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            If the deterministic engine detected a destructive database statement or an untested
            security modification, the engine sets a floor on severity, ensuring dangerous pull
            requests cannot be scored as low risk.
          </p>
        </section>

        {/* Stage 6 */}
        <section id="stage-6" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Stage 6: Relational Persistence & Presentation
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The synthesized analysis is persisted atomically using Drizzle ORM:
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              The repository is upserted into <code>repositories</code>.
            </li>
            <li>
              The pull request record is upserted into <code>pull_requests</code>.
            </li>
            <li>
              The analysis record is created in <code>analyses</code> with full JSONB metadata.
            </li>
            <li>
              A draft entry is inserted into <code>release_notes</code> with type classification (
              <code>breaking</code>, <code>feature</code>, <code>bugfix</code>, or <code>misc</code>
              ).
            </li>
          </ul>

          <p className="text-xs leading-relaxed text-muted-foreground">
            The structured response is then rendered instantly in the MergePilot dashboard and
            cached for subsequent views.
          </p>
        </section>

        <DocsPager currentPath="/docs/how-it-works" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
