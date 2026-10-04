const steps = [
  {
    step: "01",
    title: "Connect GitHub OAuth",
    description:
      "Authorize MergePilot securely with scoped read permissions to inspect your repositories and pull requests."
  },
  {
    step: "02",
    title: "Select a repository & sync pull requests",
    description:
      "Pick any repository in your workspace and browse active pull request diffs, author commits, and changesets."
  },
  {
    step: "03",
    title: "Generate summaries, risk signals & notes",
    description:
      "Receive deep risk intelligence, breaking change flags, test gap audits, and release-ready changelogs in seconds."
  }
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl border-t border-border/60 px-4 py-20 md:px-8"
    >
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Workflow
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Three steps to PR confidence.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Zero complex configuration or server infrastructure. Connect your GitHub account and
          inspect pull requests immediately.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.step}
            className="group flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-foreground/20 dark:border-[#262626] dark:bg-[#0A0A0A] dark:hover:border-zinc-700"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted/60 font-mono text-xs font-bold text-foreground dark:border-[#262626] dark:bg-[#111111]">
                  {item.step}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Step {item.step}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
