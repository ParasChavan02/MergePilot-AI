"use client";

export default function DashboardError({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">Dashboard failed to load</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button type="button" onClick={reset} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
        Retry
      </button>
    </div>
  );
}
