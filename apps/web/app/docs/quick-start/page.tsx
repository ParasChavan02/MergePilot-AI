import Link from "next/link";

import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Quick Start",
  description: "Connect GitHub and analyze your first pull request in under five minutes."
};

const tocItems: TocItem[] = [
  { title: "Prerequisites", id: "prerequisites" },
  { title: "Step 1: Connect GitHub", id: "step-1" },
  { title: "Step 2: Select a Repository", id: "step-2" },
  { title: "Step 3: Select a Pull Request", id: "step-3" },
  { title: "Step 4: Run Analysis", id: "step-4" },
  { title: "Step 5: Review Results", id: "step-5" },
  { title: "Next Steps", id: "next-steps" }
];

export default function QuickStartPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Getting Started
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Quick Start Guide
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Follow this 5-step tutorial to connect your GitHub account, browse repositories, and
            generate your first Pull Request intelligence report.
          </p>
        </div>

        {/* Prerequisites */}
        <section id="prerequisites" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Prerequisites</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Before using MergePilot, ensure you have:
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>An active GitHub account with access to public or private repositories.</li>
            <li>A repository containing at least one open or recent pull request to analyze.</li>
          </ul>

          <DocsCallout type="note" title="Local Development">
            If running MergePilot locally, ensure your PostgreSQL database is running and
            environment variables (`DATABASE_URL`, `AUTH_SECRET`, `GITHUB_CLIENT_ID`,
            `GITHUB_CLIENT_SECRET`, and `GEMINI_API_KEY`) are set. See the{" "}
            <Link
              href="/docs/configuration"
              className="text-foreground underline underline-offset-2"
            >
              Configuration guide
            </Link>
            .
          </DocsCallout>
        </section>

        {/* Step 1 */}
        <section id="step-1" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-semibold text-foreground">
              1
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Connect GitHub</h2>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Navigate to the login screen by clicking <strong>Get Started</strong> on the landing
            page or visiting <code>/login</code> directly.
          </p>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Click <strong>Continue with GitHub</strong> to initiate GitHub OAuth authentication.
            MergePilot requests the following standard permissions:
          </p>

          <div className="space-y-1.5 rounded-xl border border-border/80 bg-card p-4 font-mono text-xs text-foreground">
            <div className="flex items-center justify-between">
              <span>read:user</span>
              <span className="text-[11px] text-muted-foreground">
                Reads your public GitHub profile and username
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>user:email</span>
              <span className="text-[11px] text-muted-foreground">
                Reads your verified email address for account association
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>repo</span>
              <span className="text-[11px] text-muted-foreground">
                Accesses repositories and pull requests you have permission to view
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Upon granting authorization, MergePilot securely stores your OAuth access token in the
            PostgreSQL database and redirects you to the <strong>Dashboard</strong>.
          </p>
        </section>

        {/* Step 2 */}
        <section id="step-2" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-semibold text-foreground">
              2
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Select a Repository
            </h2>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            In your dashboard, navigate to <strong>Repositories</strong> (
            <code>/dashboard/repositories</code>). MergePilot synchronizes your GitHub account
            repositories using the authenticated Octokit client.
          </p>

          <p className="text-xs leading-relaxed text-muted-foreground">
            You can search repositories by name or filter by primary language. Click on any
            repository card to view its pull requests.
          </p>
        </section>

        {/* Step 3 */}
        <section id="step-3" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-semibold text-foreground">
              3
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Select a Pull Request
            </h2>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            The repository pulls view (<code>/dashboard/repositories/[owner]/[repo]/pulls</code>)
            lists open, closed, or merged pull requests retrieved directly from GitHub.
          </p>

          <p className="text-xs leading-relaxed text-muted-foreground">Each entry displays:</p>

          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>Pull request number and title</li>
            <li>Author username and avatar</li>
            <li>
              Branch ref (e.g. <code>main ← feature/auth-refactor</code>)
            </li>
            <li>Diff footprint (+additions / -deletions)</li>
            <li>Previous analysis status badge (if already analyzed)</li>
          </ul>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Click on the pull request you wish to evaluate.
          </p>
        </section>

        {/* Step 4 */}
        <section id="step-4" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-semibold text-foreground">
              4
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Run Analysis</h2>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            On the pull request detail view (
            <code>/dashboard/repositories/[owner]/[repo]/pulls/[number]</code>), click the{" "}
            <strong>Analyze PR</strong> button.
          </p>

          <p className="text-xs leading-relaxed text-muted-foreground">
            When triggered, MergePilot executes the following sequence:
          </p>

          <ol className="list-decimal space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>Fetches PR details, commits, and file diffs using Octokit.</li>
            <li>
              Applies context budgeting (limiting diffs to 45,000 characters to stay within token
              limits).
            </li>
            <li>
              Runs the TypeScript deterministic risk engine to scan for sensitive code paths and
              destructive SQL keywords.
            </li>
            <li>Dispatches a structured prompt to Google Gemini 2.5 Flash.</li>
            <li>
              Validates the AI response against Zod schemas and calculates composite calibrated
              risk.
            </li>
            <li>Stores the resulting intelligence record and release note draft in PostgreSQL.</li>
          </ol>
        </section>

        {/* Step 5 */}
        <section id="step-5" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-semibold text-foreground">
              5
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Review Results</h2>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Once analysis completes, the dashboard displays structured intelligence across five
            dedicated tabs:
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                1. AI Summary & Key Changes
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                A concise paragraph explaining what the PR actually does architecturally, paired
                with bullet points of key changes and operational recommendations.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                2. Risk Scorecard & Signal Reasons
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Calibrated risk score (0-100) and severity level (<code>low</code>,{" "}
                <code>medium</code>, <code>high</code>, or <code>critical</code>) accompanied by
                bulleted risk drivers.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                3. Test Gap Detection
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Itemized missing test scenarios for modified critical paths with suggested
                verification procedures.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                4. Breaking Changes
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Identified breaking contract shifts, deleted database columns, or altered API
                interfaces along with estimated blast radius.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                5. Release Notes Draft
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Markdown changelog draft categorized by features, fixes, and breaking changes, with
                a 1-click copy action.
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section id="next-steps" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Next Steps</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Now that you have run your first analysis, explore how each intelligence engine works:
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/docs/how-it-works"
              className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted"
            >
              How It Works Pipeline →
            </Link>
            <Link
              href="/docs/features/risk-analysis"
              className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted"
            >
              Risk Engine Signals →
            </Link>
            <Link
              href="/docs/architecture"
              className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted"
            >
              System Architecture →
            </Link>
          </div>
        </section>

        <DocsPager currentPath="/docs/quick-start" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
