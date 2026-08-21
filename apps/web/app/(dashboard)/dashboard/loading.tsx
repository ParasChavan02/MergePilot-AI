export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="h-32 animate-pulse rounded-2xl bg-card" />
      <div className="h-32 animate-pulse rounded-2xl bg-card" />
    </div>
  );
}
