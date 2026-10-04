import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "AI Summary",
  description:
    "Learn how MergePilot converts pull request context into a high-signal engineering summary."
};

const tocItems: TocItem[] = [
  { title: "Overview", id: "overview" },
  { title: "Purpose & Grounding", id: "purpose" },
  { title: "Inputs Analyzed", id: "inputs" },
  { title: "Outputs Generated", id: "outputs" },
  { title: "Representative Example", id: "example" },
  { title: "Actionable Recommendations", id: "recommendations" },
  { title: "Limitations", id: "limitations" }
];

export default function AiSummaryPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Core Features
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            AI Summary
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            MergePilot converts pull request context into a concise explanation of what changed,
            architectural intent, and operational blast radius.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Reading raw code diffs across multiple files often obscures the primary intent of a pull
            request. The AI Summary provides immediate high-level comprehension, answering{" "}
            <em>&ldquo;What does this change do, and why was it implemented?&rdquo;</em> in seconds.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Unlike general-purpose conversational LLMs, MergePilot&apos;s summary engine is
            specifically prompted to reject stylistic commentary or subjective praising. It delivers
            crisp, technical prose structured for senior engineers and tech leads.
          </p>
        </section>

        {/* Purpose & Grounding */}
        <section id="purpose" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Purpose & Grounding
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The system prompt strictly enforces strict code grounding:
          </p>
          <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">Strict Grounding:</strong> The engine must only
              reference files, functions, variables, and architectural patterns evidenced in the
              provided git diff.
            </li>
            <li>
              <strong className="text-foreground">No Hallucinations:</strong> The engine is
              forbidden from inventing hypothetical external services, third-party libraries, or
              database columns not present in the PR context.
            </li>
            <li>
              <strong className="text-foreground">Fact vs Inference Separation:</strong> The summary
              distinguishes verified code modifications from potential architectural blast radius.
            </li>
          </ul>

          <DocsCallout type="note" title="Engineering Tone">
            The model writes in concise, technical language matching the voice of a staff software
            engineer reviewing an urgent production pull request.
          </DocsCallout>
        </section>

        {/* Inputs Analyzed */}
        <section id="inputs" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Inputs Analyzed</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The AI Summary synthesizes multiple dimensions of context gathered from the GitHub API:
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Pull Request Metadata
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Repository name, base and head branches, PR title, author description, and aggregate
                additions/deletions.
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Commit History
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Up to 30 recent commit messages with SHA references and author attribution to
                understand iterative progression.
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Normalized File Diffs
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Individual file patches up to the 45,000-character budget, prioritized by
                modification significance.
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Deterministic Signal State
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Pre-computed signals from the rule engine identifying sensitive file paths,
                destructive SQL, or dependency changes.
              </p>
            </div>
          </div>
        </section>

        {/* Outputs Generated */}
        <section id="outputs" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Outputs Generated
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The summary engine produces two core elements:
          </p>
          <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">High-Signal Summary Paragraph:</strong> A focused
              narrative explaining what the pull request achieves, the components touched, and its
              primary architectural purpose.
            </li>
            <li>
              <strong className="text-foreground">Key Changes List:</strong> An itemized array of
              concrete code changes (e.g. schema additions, middleware modifications, route
              refactors).
            </li>
          </ul>
        </section>

        {/* Representative Example */}
        <section id="example" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Representative Example
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Below is a representative example of how the summary and key changes appear in the
            dashboard:
          </p>

          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Summary
              </span>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground">
                This pull request refactors session handling across application route handlers,
                migrating token verification from legacy cookies to signed JSON Web Tokens (JWT). It
                updates authentication middleware to reject expired tokens with 401 redirects and
                adds database indexing on active sessions.
              </p>
            </div>

            <div className="border-t border-border/60 pt-4">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Key Changes
              </span>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground marker:text-foreground">
                <li>
                  Migrated session strategy in <code>server/auth.ts</code> to JWT strategy.
                </li>
                <li>
                  Added route protection check in middleware for <code>/dashboard/*</code>{" "}
                  endpoints.
                </li>
                <li>
                  Added composite B-Tree index on <code>sessions(user_id, expires)</code> in
                  database schema.
                </li>
              </ul>
            </div>
          </div>

          <DocsCallout type="tip" title="Representative Data">
            The example above illustrates output format; actual summaries reflect the specific files
            and diffs in your pull request.
          </DocsCallout>
        </section>

        {/* Actionable Recommendations */}
        <section id="recommendations" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Actionable Recommendations
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Alongside the summary, MergePilot outputs 2 to 5 targeted recommendations for deploying
            and validating the change:
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>Staging verification steps for modified workflows.</li>
            <li>Canary rollout and progressive delivery suggestions.</li>
            <li>Rollback and backward-compatibility considerations for database schema changes.</li>
          </ul>
        </section>

        {/* Limitations */}
        <section id="limitations" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Limitations</h2>
          <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">Patch Truncation on Giant PRs:</strong> If a pull
              request modifies hundreds of files or exceeds the 45,000-character patch limit, diffs
              for lower-priority files are omitted. File names and addition/deletion counts remain
              visible.
            </li>
            <li>
              <strong className="text-foreground">Binary & Asset Files:</strong> Binary assets,
              bundled minified JavaScript, and images are not passed to the LLM.
            </li>
            <li>
              <strong className="text-foreground">Runtime State:</strong> MergePilot analyzes static
              code diffs and metadata; it does not execute live code or simulate runtime database
              states.
            </li>
          </ul>
        </section>

        <DocsPager currentPath="/docs/features/ai-summary" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
