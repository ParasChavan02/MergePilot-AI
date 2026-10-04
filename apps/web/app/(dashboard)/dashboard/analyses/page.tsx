import { AnalysesList } from "@/features/analyses/analyses-list";

export default function AnalysesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Intelligence History
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Pull Request Analyses
        </h1>
        <p className="max-w-2xl text-xs text-muted-foreground md:text-sm">
          All architectural intelligence reports, risk scores, breaking change evaluations, and test
          gap audits.
        </p>
      </header>

      <AnalysesList />
    </div>
  );
}
