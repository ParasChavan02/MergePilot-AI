import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Changelog",
  description: "Product updates and engineering releases for MergePilot AI."
};

const tocItems: TocItem[] = [
  { title: "Release History", id: "history" },
  { title: "v0.1.0 Initial Release", id: "v0-1-0" }
];

export default function ChangelogPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Reference
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Changelog
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Product updates and engineering changes will be documented here.
          </p>
        </div>

        {/* Release History */}
        <section id="history" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Release History</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot AI follows semantic versioning. Platform improvements, security enhancements,
            and feature rollouts are cataloged below.
          </p>
        </section>

        {/* v0.1.0 */}
        <section id="v0-1-0" className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              v0.1.0
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Initial Platform Release
            </span>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Core Platform Launch
            </h3>

            <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
              <li>
                <strong className="text-foreground">GitHub OAuth Integration:</strong> Secure
                authentication via Auth.js v5 with repository and email read scopes.
              </li>
              <li>
                <strong className="text-foreground">Deterministic Risk Engine:</strong> In-process
                TypeScript rule engine evaluating sensitive file regexes, destructive database
                queries, and test omission flags.
              </li>
              <li>
                <strong className="text-foreground">Google Gemini 2.5 Flash Pipeline:</strong>{" "}
                Structured JSON analysis producing high-signal summaries, breaking changes, test gap
                identification, and markdown release notes.
              </li>
              <li>
                <strong className="text-foreground">Context Budgeting:</strong> 45,000-character
                diff capping mechanism protecting against token exhaustion on large pull requests.
              </li>
              <li>
                <strong className="text-foreground">Monochrome Developer UI:</strong> Strict black
                and white SaaS design system with light and dark mode support.
              </li>
            </ul>
          </div>
        </section>

        <DocsPager currentPath="/docs/changelog" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
