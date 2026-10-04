import { DashboardOverview } from "@/features/dashboard/dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Intelligence Overview
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Dashboard</h1>
        <p className="max-w-2xl text-xs text-muted-foreground md:text-sm">
          Real-time metrics, risk scoring, and intelligence across your connected repositories.
        </p>
      </header>

      <DashboardOverview />
    </div>
  );
}
