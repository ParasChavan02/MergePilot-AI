import { AlertTriangle, CheckCircle2, FileCode, FolderGit2, ShieldAlert, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI PR summaries",
    description:
      "Understand complex diffs and architectural intent without reading every individual line."
  },
  {
    icon: ShieldAlert,
    title: "Risk analysis",
    description:
      "Deterministic signal scoring surfaces changes that deserve critical team scrutiny before merge."
  },
  {
    icon: AlertTriangle,
    title: "Breaking change detection",
    description:
      "Identify modified interfaces, deprecated endpoints, and schema shifts before they reach production."
  },
  {
    icon: CheckCircle2,
    title: "Test gap detection",
    description:
      "Audit altered critical logic paths that lack associated unit or integration test assertions."
  },
  {
    icon: FileCode,
    title: "Release notes",
    description:
      "Compile merged pull requests automatically into clean, Markdown-formatted release changelogs."
  },
  {
    icon: FolderGit2,
    title: "Repository intelligence",
    description:
      "Build deep continuous context across repositories, branches, and multi-file changesets."
  }
] as const;

export function FeatureSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Platform Features
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Everything engineering teams need to verify PRs.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Minimal surface area, maximum signal. Automated pull request intelligence designed for
          high-velocity teams.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm dark:border-[#262626] dark:bg-[#0A0A0A] dark:hover:border-zinc-700 dark:hover:bg-[#111111]"
            >
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground transition-colors group-hover:border-foreground/30 dark:border-[#262626] dark:bg-[#111111] dark:text-zinc-300 dark:group-hover:border-zinc-600 dark:group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </div>

                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
