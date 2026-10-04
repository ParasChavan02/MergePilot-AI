import { RepositoryList } from "@/features/repositories/repository-list";

export default function RepositoriesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          GitHub Repositories
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Repositories
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a connected repository to inspect pull requests and run intelligence analyses.
        </p>
      </div>

      <RepositoryList />
    </div>
  );
}
