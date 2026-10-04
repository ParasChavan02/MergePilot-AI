import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Roadmap",
  description:
    "Explore current implemented capabilities and planned future features for MergePilot AI."
};

const tocItems: TocItem[] = [
  { title: "Overview", id: "overview" },
  { title: "Current (Implemented)", id: "current" },
  { title: "Planned (Roadmap)", id: "planned" }
];

export default function RoadmapPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Reference
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Product Roadmap
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A transparent overview of implemented production capabilities versus planned future
            features.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot is built with a commitment to technical precision and operational
            reliability. Features listed under <strong>Current</strong> are fully implemented and
            functional in the active codebase. Features under <strong>Planned</strong> are queued
            for upcoming releases.
          </p>
        </section>

        {/* Current */}
        <section id="current" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-foreground" />
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Current (Implemented)
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                GitHub OAuth & Octokit Integration
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Sign in with GitHub, secure access token persistence in PostgreSQL, and
                repository/PR synchronization.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Deterministic Risk Engine
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Static regex analysis for auth, database, security, and payments, plus destructive
                SQL pattern scanning.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Context Budgeting (45K Patch Cap)
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Protects AI reasoning from context degradation on large PRs while preserving file
                metadata and counts.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Gemini 2.5 Flash Structured Inference
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                High-speed JSON mode analysis producing engineering summaries, key changes, and
                recommendations.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Test Gap & Breaking Change Detection
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Flags untested sensitive logic with verification steps, and detects breaking
                contract shifts with blast radius.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Release Notes Feed & 1-Click Copy
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Drafts categorized markdown release notes stored in the database with instant
                clipboard copying.
              </p>
            </div>
          </div>
        </section>

        {/* Planned */}
        <section id="planned" className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full border border-foreground bg-transparent" />
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Planned (Roadmap)
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                GitHub Webhooks Automation
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Automatic PR analysis triggered in real-time when pull requests are opened or
                synchronized.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-card/50 p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Automated GitHub PR Comments
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                A MergePilot GitHub App bot that automatically comments the risk scorecard and test
                gaps on GitHub PRs.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-card/50 p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Custom Organization Risk Rulesets
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Configurable risk weights, mandatory test thresholds per directory, and custom
                destructive keyword regexes.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-card/50 p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Slack & Discord Webhook Alerts
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Real-time incident prevention alerts dispatched to engineering team channels when a
                high or critical PR is opened.
              </p>
            </div>
          </div>

          <DocsCallout type="note" title="Feedback & Requests">
            Have a feature request or need custom enterprise integrations? Open an issue or
            discussion on the{" "}
            <a
              href="https://github.com/ParasChavan02/MergePilot-AI"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              GitHub repository
            </a>
            .
          </DocsCallout>
        </section>

        <DocsPager currentPath="/docs/roadmap" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
