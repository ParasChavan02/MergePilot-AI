import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Breaking Changes",
  description:
    "Learn how MergePilot identifies API contract modifications, schema alterations, and downstream blast radius."
};

const tocItems: TocItem[] = [
  { title: "Overview", id: "overview" },
  { title: "Detection Categories", id: "categories" },
  { title: "Breaking Changes Schema", id: "schema" },
  { title: "Representative Examples", id: "examples" },
  { title: "Blast Radius Evaluation", id: "blast-radius" },
  { title: "Limitations", id: "limitations" }
];

export default function BreakingChangesPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Core Features
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Breaking Change Detection
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            MergePilot evaluates pull requests for API contract shifts, deleted database columns,
            and breaking interface changes before they reach staging or production.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Breaking changes are modifications that invalidate existing client contracts, break
            dependent services, or cause database query failures for active sessions.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot scans both the structural diff and semantic intent of the pull request to
            distinguish between safe additive enhancements and breaking modifications.
          </p>
        </section>

        {/* Detection Categories */}
        <section id="categories" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Detection Categories
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The detection engine evaluates changes against five primary breaking change vectors:
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                API Route Contracts
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Renamed endpoints, removed JSON payload keys, changed HTTP status codes, or new
                required request headers.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Database Schema Shifts
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Dropped tables, removed or renamed columns, modified column constraints (e.g.{" "}
                <code>NOT NULL</code> on existing rows), or destructive DDL.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Exported Interface Signatures
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Modified function arguments, altered return types in shared library code, or removed
                exported symbols.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                Configuration & Environment
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                New mandatory environment variables required at runtime that will cause startup
                crashes if unconfigured.
              </p>
            </div>
          </div>
        </section>

        {/* Breaking Changes Schema */}
        <section id="schema" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Breaking Changes Schema
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The output is validated by Zod against the following type definition (
            <code>server/ai/schemas.ts</code>):
          </p>

          <DocsCodeBlock
            language="typescript"
            filename="server/ai/schemas.ts"
            code={`export const breakingChangeItemSchema = z.object({
  area: z.string().describe("Component, API, schema, or system area affected"),
  reason: z.string().describe("Specific breaking change explanation"),
  potentialImpact: z.string().describe("Consequences or blast radius if merged")
});

export const breakingChangesSchema = z.object({
  detected: z.boolean(),
  severity: z.enum(["none", "low", "medium", "high", "critical"]).default("none"),
  items: z.array(breakingChangeItemSchema).default([])
});`}
          />
        </section>

        {/* Representative Examples */}
        <section id="examples" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Representative Examples
          </h2>

          <div className="space-y-4">
            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  Detected Breaking Change
                </span>
                <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  High Severity
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Area:</strong>{" "}
                <code>GET /api/github/repos</code>
                <br />
                <strong className="text-foreground">Reason:</strong> Renamed returned property from{" "}
                <code>repo_id</code> to <code>githubId</code>.<br />
                <strong className="text-foreground">Potential Impact:</strong> Client components and
                external consumers reading <code>repo_id</code> will receive <code>undefined</code>{" "}
                and fail silently or crash.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  Non-Breaking Additive Change
                </span>
                <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  No Breaking Change Detected
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Area:</strong> Database Schema (
                <code>db/schema.ts</code>)<br />
                <strong className="text-foreground">Reason:</strong> Added optional column{" "}
                <code>description: text(&quot;description&quot;)</code> with default{" "}
                <code>null</code>.<br />
                <strong className="text-foreground">Verdict:</strong> Safe additive migration;
                existing query contracts remain fully backward-compatible.
              </p>
            </div>
          </div>
        </section>

        {/* Blast Radius Evaluation */}
        <section id="blast-radius" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Blast Radius Evaluation
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            For every detected breaking change, MergePilot assesses the{" "}
            <strong>potential blast radius</strong>:
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong>Internal Blast Radius:</strong> Affects other files or modules within the
              repository.
            </li>
            <li>
              <strong>External Client Blast Radius:</strong> Affects mobile apps, third-party
              integrations, or frontend consumers consuming the modified API routes.
            </li>
            <li>
              <strong>Data Integrity Blast Radius:</strong> Destructive migrations that could cause
              data loss or lock active database tables.
            </li>
          </ul>
        </section>

        {/* Limitations */}
        <section id="limitations" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Limitations</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot performs static diff reasoning and pattern inspection. It does not execute a
            full compiler cross-repository type-check (e.g. across multiple decoupled monorepos) or
            live schema migration dry-runs. Teams should continue running their continuous
            integration type-checking and automated test suites.
          </p>
        </section>

        <DocsPager currentPath="/docs/features/breaking-changes" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
