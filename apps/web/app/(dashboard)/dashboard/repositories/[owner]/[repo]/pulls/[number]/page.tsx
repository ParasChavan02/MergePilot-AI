import { PullRequestDetails } from "@/features/pull-requests/pull-request-details";

interface PullDetailPageProps {
  params: Promise<{
    owner: string;
    repo: string;
    number: string;
  }>;
}

export default async function PullDetailPage({ params }: PullDetailPageProps) {
  const { owner, repo, number } = await params;
  const prNumber = parseInt(number, 10);

  return (
    <div className="mx-auto max-w-7xl py-2">
      <PullRequestDetails owner={owner} repo={repo} prNumber={prNumber} />
    </div>
  );
}
