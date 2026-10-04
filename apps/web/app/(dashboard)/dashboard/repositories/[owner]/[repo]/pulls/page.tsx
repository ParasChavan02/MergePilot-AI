import { PullRequestList } from "@/features/pull-requests/pull-request-list";

interface PullsPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export default async function RepositoryPullsPage({ params }: PullsPageProps) {
  const { owner, repo } = await params;

  return (
    <div className="mx-auto max-w-7xl py-2">
      <PullRequestList owner={owner} repo={repo} />
    </div>
  );
}
