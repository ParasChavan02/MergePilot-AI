import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Test Gap Detection",
  description:
    "Learn how MergePilot identifies untested sensitive code paths and provides actionable verification suggestions."
};

const tocItems: TocItem[] = [
  { title: "Overview", id: "overview" },
  { title: "Detection Architecture", id: "detection-architecture" },
  { title: "Deterministic Guardrail Injection", id: "guardrails" },
  { title: "Representative Example", id: "example" },
  { title: "Verification Workflow", id: "workflow" },
  { title: "Limitations", id: "limitations" }
];

export default function TestGapsPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Core Features
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Test Gap Detection
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            MergePilot automatically identifies untested sensitive logic, migrations, or security
            changes and suggests concrete verification steps before merging.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            One of the most frequent causes of production regressions is modifying sensitive
            business logic without adding or updating corresponding unit or integration tests.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot examines both the pull request file list and the functional scope of the
            diff. If critical system behaviors are modified without test coverage, it flags the
            omission and advises the reviewer on what verification procedure should be executed.
          </p>
        </section>

        {/* Detection Architecture */}
        <section id="detection-architecture" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Detection Architecture
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Test gap analysis combines deterministic file inspection with contextual AI reasoning:
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                1. Test File Identification
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                The engine checks whether the pull request touches any files matching recognized
                testing conventions: <code>.test.</code>, <code>.spec.</code>,{" "}
                <code>__tests__/</code>, or <code>/test/</code>.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                2. Critical Area Cross-Referencing
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                If the pull request contains high-severity modifications (authentication,
                authorization, database migrations, or payments) and <code>hasTests === false</code>
                , the deterministic engine logs a high-severity test gap signal.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                3. Semantic Test Gap Reasoning
              </span>
              <p className="mt-1 text-xs text-muted-foreground">
                Google Gemini analyzes the diff to identify specific untested branches, boundary
                conditions, or unhandled exceptions and returns itemized entries structured as:
              </p>
              <div className="mt-2 rounded-lg bg-muted/60 p-2.5 font-mono text-[11px] text-foreground">
                <code>
                  &#123; test: string, reason: string, suggestedVerification: string &#125;
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Deterministic Guardrail Injection */}
        <section id="guardrails" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Deterministic Guardrail Injection
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            To guarantee safety against LLM omissions, MergePilot includes an automated code-level
            safeguard in <code>server/ai/analyze-pr.ts</code>:
          </p>

          <DocsCallout type="important" title="Automatic Fallback Injection">
            If the deterministic engine detects modifications to critical security, authentication,
            or database files without any accompanying test files, and the AI model fails to output
            any test gaps, MergePilot automatically injects a verified fallback test gap:
            <div className="mt-2 font-mono text-[11px] text-foreground">
              &bull; <strong>Test:</strong> Automated regression tests for modified sensitive files
              <br />
              &bull; <strong>Reason:</strong> High-risk authentication, security, or database files
              were modified without accompanying test updates.
              <br />
              &bull; <strong>Verification:</strong> Run end-to-end integration tests covering the
              affected authorization and data access flows.
            </div>
          </DocsCallout>
        </section>

        {/* Representative Example */}
        <section id="example" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Representative Example
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Below is an example of how test gaps are presented in the MergePilot dashboard:
          </p>

          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-foreground">
                Missing Integration Test for Token Renewal Flow
              </span>
              <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                High Priority
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Why this is risky:
                </span>
                <p className="mt-0.5 text-muted-foreground">
                  The authentication callback and JWT refresh cycle were updated in{" "}
                  <code>server/auth.ts</code>, but no test cases verify token expiration or
                  rejection of revoked credentials.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Suggested Verification:
                </span>
                <p className="mt-0.5 rounded-md bg-muted/40 p-2 font-mono text-[11px] text-muted-foreground">
                  Simulate an expired session token via mock cookie and assert that the middleware
                  initiates an HTTP 401 redirect to /login.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Workflow */}
        <section id="workflow" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Verification Workflow
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Engineering teams can integrate test gap detection into their review checklist:
          </p>
          <ol className="list-decimal space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>Review the itemized test gaps during PR review.</li>
            <li>
              Request that the author add automated unit or integration tests for high-priority
              items.
            </li>
            <li>
              Alternatively, manually execute the suggested verification in a staging or preview
              environment before approving the merge.
            </li>
          </ol>
        </section>

        {/* Limitations */}
        <section id="limitations" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Limitations</h2>
          <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">Repository-Wide Coverage:</strong> MergePilot
              analyzes the pull request diff, not the entire test suite history across the
              repository. If tests exist in an unmodified file, MergePilot may advise verifying
              existing coverage.
            </li>
            <li>
              <strong className="text-foreground">Static Inference:</strong> The engine does not
              execute test suites or measure lcov code coverage percentages.
            </li>
          </ul>
        </section>

        <DocsPager currentPath="/docs/features/test-gaps" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
