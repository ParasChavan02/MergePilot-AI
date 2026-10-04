import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Risk Analysis",
  description:
    "Understand the deterministic risk signals and calibrated risk scoring engine in MergePilot."
};

const tocItems: TocItem[] = [
  { title: "Overview", id: "overview" },
  { title: "Deterministic Signal Architecture", id: "deterministic-signals" },
  { title: "Risk Rules & Weight Table", id: "risk-table" },
  { title: "Destructive Database DDL/DML Detection", id: "destructive-sql" },
  { title: "PR Footprint & Testing Signals", id: "footprint-testing" },
  { title: "Risk Synthesis Formula", id: "synthesis" },
  { title: "Risk Severities & Thresholds", id: "severities" }
];

export default function RiskAnalysisPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Core Features
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Risk Analysis
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            MergePilot pairs a deterministic static code rule engine with AI contextual evaluation
            to calculate a calibrated risk score for every pull request.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Relying solely on LLM evaluation for deployment risk can produce inconsistent ratings
            because natural language models lack hard deterministic boundaries. Conversely, rigid
            static analysis rules often generate false alarms on minor refactors.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot solves this with a hybrid architecture:
          </p>
          <div className="rounded-xl border border-border bg-[#F5F5F5] p-4 font-mono text-xs text-foreground dark:bg-[#111111]">
            Input → Deterministic Code Signals → AI Contextual Reasoning → Calibrated Blended Risk →
            Dashboard
          </div>
        </section>

        {/* Deterministic Signal Architecture */}
        <section id="deterministic-signals" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Deterministic Signal Architecture
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Before any prompt is sent to Google Gemini, the deterministic engine (
            <code>server/risk/engine.ts</code>) inspects all changed files, file names, commit
            stats, and line patches.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            It scans for sensitive application vectors, flags destructive queries, checks for
            automated test coverage, and calculates an initial baseline risk score starting at{" "}
            <strong>10 points</strong>.
          </p>
        </section>

        {/* Risk Rules & Weight Table */}
        <section id="risk-table" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Risk Rules & Weight Table
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The deterministic engine evaluates files against the following regex patterns and
            weights:
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-border bg-muted/60 text-muted-foreground">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Matched Patterns</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                <tr>
                  <td className="p-3 font-semibold">auth</td>
                  <td className="p-3 text-muted-foreground">
                    auth, session, jwt, oauth, login, signup, password, credential
                  </td>
                  <td className="p-3">High</td>
                  <td className="p-3">+35</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">security</td>
                  <td className="p-3 text-muted-foreground">
                    crypto, security, permission, rbac, acl, cors, sanitize, csrf
                  </td>
                  <td className="p-3">High</td>
                  <td className="p-3">+35</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">payments</td>
                  <td className="p-3 text-muted-foreground">
                    stripe, payment, billing, checkout, subscription, invoice
                  </td>
                  <td className="p-3">High</td>
                  <td className="p-3">+35</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">database</td>
                  <td className="p-3 text-muted-foreground">
                    migration, migrate, schema.prisma, drizzle, migrations/, .sql
                  </td>
                  <td className="p-3">High</td>
                  <td className="p-3">+30</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">infrastructure</td>
                  <td className="p-3 text-muted-foreground">
                    docker, k8s, kubernetes, terraform, .github/workflows, helm
                  </td>
                  <td className="p-3">Medium</td>
                  <td className="p-3">+25</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">config</td>
                  <td className="p-3 text-muted-foreground">.env, config/env, secrets</td>
                  <td className="p-3">Medium</td>
                  <td className="p-3">+25</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">dependencies</td>
                  <td className="p-3 text-muted-foreground">
                    package.json, pnpm-lock.yaml, yarn.lock, package-lock.json
                  </td>
                  <td className="p-3">Medium</td>
                  <td className="p-3">+15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Destructive Database DDL/DML Detection */}
        <section id="destructive-sql" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Destructive Database DDL/DML Detection
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Beyond file paths, the engine evaluates file diff patches against a regular expression
            targeting irreversible data operations:
          </p>

          <DocsCodeBlock
            language="typescript"
            filename="server/risk/engine.ts"
            code={`const DESTRUCTIVE_DB_REGEX = /\\b(drop\\s+table|drop\\s+column|truncate|delete\\s+from|cascade)\\b/i;`}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            If any patch contains a keyword such as <code>DROP TABLE</code> or <code>TRUNCATE</code>
            , the engine immediately fires a <strong>Critical</strong> severity signal with a weight
            of <strong>+40</strong> and logs the affected file.
          </p>

          <DocsCallout type="warning" title="Safety Enforcement">
            Destructive SQL signals force a floor on the final risk rating. Even if an AI model
            reports low risk, the synthesized rating will remain High or Critical.
          </DocsCallout>
        </section>

        {/* PR Footprint & Testing Signals */}
        <section id="footprint-testing" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            PR Footprint & Testing Signals
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Two heuristic signals evaluate operational footprint:
          </p>
          <ul className="list-disc space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">Large PR Blast Radius (+15 weight):</strong>{" "}
              Triggered when total additions and deletions exceed 600 lines, or more than 25 files
              are touched.
            </li>
            <li>
              <strong className="text-foreground">Untested Critical Changes (+20 weight):</strong>{" "}
              Triggered if high/critical areas (auth, security, payments, database) are modified
              without any accompanying automated test files (<code>.test.</code>,{" "}
              <code>.spec.</code>, <code>__tests__/</code>, or <code>/test/</code>).
            </li>
            <li>
              <strong className="text-foreground">Documentation Exemption:</strong> If a pull
              request consists exclusively of documentation files (<code>.md</code>,{" "}
              <code>.txt</code>, <code>docs/</code>, or <code>license</code>), all other signals are
              bypassed and a fixed score of <strong>5 (Low)</strong> is assigned.
            </li>
          </ul>
        </section>

        {/* Risk Synthesis Formula */}
        <section id="synthesis" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Risk Synthesis Formula
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The final score blends the deterministic assessment with Gemini&apos;s contextual
            reasoning:
          </p>

          <DocsCodeBlock
            language="typescript"
            filename="server/risk/engine.ts"
            code={`export function synthesizeRisk(
  deterministic: DeterministicRiskAssessment,
  aiRisk: { level: RiskLevel; score: number; reasons: string[] }
): { level: RiskLevel; score: number; reasons: string[] } {
  // 45% deterministic structural code signals + 55% AI contextual reasoning
  const blendedScore = Math.round(deterministic.score * 0.45 + aiRisk.score * 0.55);
  const finalScore = Math.min(Math.max(blendedScore, 5), 100);

  // Floor severity if critical keywords or zero-test security changes detected
  let finalLevel: RiskLevel;
  if (finalScore >= 80 || deterministic.signals.some((s) => s.severity === "critical")) {
    finalLevel = finalScore >= 90 ? "critical" : "high";
  } else if (finalScore >= 45 || deterministic.level === "medium" || aiRisk.level === "medium") {
    finalLevel = "medium";
  } else {
    finalLevel = "low";
  }

  const combinedReasons = Array.from(new Set([...deterministic.reasons, ...aiRisk.reasons])).slice(0, 8);

  return { level: finalLevel, score: finalScore, reasons: combinedReasons };
}`}
          />
        </section>

        {/* Risk Severities & Thresholds */}
        <section id="severities" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Risk Severities & Thresholds
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot assigns one of four risk levels, styled in strict monochrome hierarchy:
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">LOW</span>
                <span className="font-mono text-[10px] text-muted-foreground">Score &lt; 45</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Routine UI adjustments, documentation edits, or well-tested non-critical features.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">MEDIUM</span>
                <span className="font-mono text-[10px] text-muted-foreground">Score 45 - 79</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Standard application business logic, package dependency updates, or moderate PR
                size.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">HIGH</span>
                <span className="font-mono text-[10px] text-muted-foreground">Score 80 - 89</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Database schema migrations, authentication alterations, or security boundary
                modifications.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">CRITICAL</span>
                <span className="font-mono text-[10px] text-muted-foreground">Score ≥ 90</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Destructive database DDL, zero-test security changes, or high blast-radius systemic
                shifts.
              </p>
            </div>
          </div>
        </section>

        <DocsPager currentPath="/docs/features/risk-analysis" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
