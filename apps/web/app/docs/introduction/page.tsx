import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Introduction",
  description:
    "Learn what MergePilot is, the problem it solves, and how it fits into the pull request review workflow."
};

const tocItems: TocItem[] = [
  { title: "Overview", id: "overview" },
  { title: "The Problem", id: "the-problem" },
  { title: "Product Positioning", id: "positioning" },
  { title: "High-Level Workflow", id: "workflow" },
  { title: "Engineering Principles", id: "principles" }
];

export default function IntroductionPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Getting Started
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Introduction
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            MergePilot AI is an AI-powered GitHub Pull Request Intelligence Platform designed to
            help engineering teams understand changes before they merge them.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Modern software engineering teams frequently experience review bottlenecks. Code reviews
            require engineers to inspect hundreds of lines of diffs across multiple files, infer
            architectural intent, evaluate edge cases, and ensure production stability.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot bridges the gap between raw git diffs and engineering confidence by providing
            automated, high-signal intelligence for every pull request. Rather than focusing on
            stylistic nitpicks or formatting, MergePilot highlights system-level risks, breaking
            contract shifts, and critical testing omissions.
          </p>
        </section>

        {/* The Problem */}
        <section id="the-problem" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">The Problem</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            As repositories grow in scale and velocity, pull requests become larger and more
            interconnected. When pull requests involve multiple services, database schemas, and
            permission boundaries, reviewers often struggle with:
          </p>

          <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">Incomplete Context:</strong> Understanding what
              changed and why across dozens of modified files without reading every line of code.
            </li>
            <li>
              <strong className="text-foreground">Hidden Blast Radius:</strong> Changes to shared
              utilities, middleware, or database tables can trigger unintended side effects in
              unrelated modules.
            </li>
            <li>
              <strong className="text-foreground">Silent Breaking Changes:</strong> Removed database
              columns, renamed API route parameters, or changed payload structures that break
              downstream consumers.
            </li>
            <li>
              <strong className="text-foreground">Untested Sensitive Paths:</strong> Critical
              security, authentication, or payment logic modified without corresponding automated
              test assertions.
            </li>
            <li>
              <strong className="text-foreground">Deployment Overhead:</strong> Manually drafting
              changelogs and release notes across multiple merged pull requests.
            </li>
          </ul>

          <DocsCallout type="note" title="Engineering Focus">
            MergePilot is designed specifically for technical teams. It provides concise, actionable
            signals rather than lengthy generic summaries.
          </DocsCallout>
        </section>

        {/* Product Positioning */}
        <section id="positioning" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Product Positioning
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">
              MergePilot adds an intelligence layer on top of GitHub pull requests.
            </strong>
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            It does not attempt to replace human code review. Instead, it equips reviewers with
            immediate, structured context before they approve or merge code:
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                What Changed
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Synthesizes the actual architectural intent and system-level modifications from the
                PR diff and commits.
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                What Could Break
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Evaluates risk vectors including authentication, destructive SQL statements,
                permissions, and external dependencies.
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                What Needs Testing
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Identifies missing automated tests for modified business logic and provides concrete
                verification suggestions.
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                What to Communicate
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Generates a clean markdown release note draft ready for internal changelogs or
                external release documentation.
              </p>
            </div>
          </div>
        </section>

        {/* High-Level Workflow */}
        <section id="workflow" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            High-Level Workflow
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot connects to GitHub using secure OAuth and inspects pull requests on demand:
          </p>

          <div className="rounded-xl border border-border bg-[#F5F5F5] p-5 font-mono text-xs text-foreground dark:bg-[#111111]">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <span>GitHub Account (OAuth Authentication)</span>
              <span className="text-muted-foreground"> ↓</span>
              <span>Repository Selection</span>
              <span className="text-muted-foreground"> ↓</span>
              <span>Pull Request Inspection</span>
              <span className="text-muted-foreground"> ↓</span>
              <span>Context Normalization & Token Budgeting (45K Patch Cap)</span>
              <span className="text-muted-foreground"> ↓</span>
              <span>Deterministic Signal Analysis (Patterns, Keywords, File Types)</span>
              <span className="text-muted-foreground"> ↓</span>
              <span>Gemini 2.5 Flash Structured Inference</span>
              <span className="text-muted-foreground"> ↓</span>
              <span className="font-semibold text-foreground">
                Composite Intelligence: Summary • Risk • Test Gaps • Breaking Changes • Release
                Notes
              </span>
            </div>
          </div>
        </section>

        {/* Engineering Principles */}
        <section id="principles" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Engineering Principles
          </h2>
          <div className="space-y-3 text-xs text-muted-foreground">
            <p>
              <strong className="text-foreground">1. Grounded in Code:</strong> The analysis engine
              references only files, symbols, and logic present in the pull request diff and
              metadata. Hallucinations are actively minimized through strict schema validation and
              bounded system prompts.
            </p>
            <p>
              <strong className="text-foreground">2. Deterministic Foundation:</strong> Critical
              security keywords, destructive database commands (`DROP TABLE`, `TRUNCATE`), and
              missing test flags are evaluated deterministically in TypeScript code before AI
              synthesis.
            </p>
            <p>
              <strong className="text-foreground">3. Actionable Outputs:</strong> Analysis results
              provide itemized areas, reasons, and suggested verification steps that engineers can
              directly act upon in staging or local environments.
            </p>
          </div>
        </section>

        <DocsPager currentPath="/docs/introduction" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
