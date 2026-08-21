import { EmptyState } from "@/features/dashboard/empty-state";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">Your review intelligence workspace</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          This shell is ready for repositories, pull requests, and analyses once the product starts
          ingesting data.
        </p>
      </header>
      <EmptyState />
    </section>
  );
}
