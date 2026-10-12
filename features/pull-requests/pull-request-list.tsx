"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileCode,
  GitPullRequest,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SpotlightCard } from "@/components/magicui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { GitHubPullRequest } from "@/server/github/types";

interface PullRequestListProps {
  owner: string;
  repo: string;
}

export function PullRequestList({ owner, repo }: PullRequestListProps) {
  const [prs, setPrs] = useState<GitHubPullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stateFilter, setStateFilter] = useState<"all" | "open" | "closed">("open");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPRs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/repos/${owner}/${repo}/pulls?state=${stateFilter}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load pull requests");
      }

      setPrs(data.pullRequests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pull requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, repo, stateFilter]);

  const filteredPRs = useMemo(() => {
    return prs.filter((pr) => {
      const q = searchQuery.toLowerCase();
      return (
        pr.title.toLowerCase().includes(q) ||
        String(pr.number).includes(q) ||
        pr.author.login.toLowerCase().includes(q)
      );
    });
  }, [prs, searchQuery]);

  const stats = useMemo(() => {
    const open = prs.filter((p) => p.state === "open").length;
    const closed = prs.filter((p) => p.state === "closed" || p.state === "merged").length;
    const analyzed = prs.filter((p) => Boolean(p.analysis)).length;
    const highRisk = prs.filter(
      (p) => p.analysis?.riskLevel === "high" || p.analysis?.riskLevel === "critical"
    ).length;

    return { open, closed, analyzed, highRisk };
  }, [prs]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Repo Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Link
              href="/dashboard/repositories"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Repositories
            </Link>
            <span className="text-border">/</span>
            <span>{owner}</span>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground">{repo}</span>
          </div>

          <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            <GitPullRequest className="h-6 w-6 text-muted-foreground" />
            Pull Requests
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://github.com/${owner}/${repo}/pulls`}
            target="_blank"
            rel="noreferrer"
            className="shadow-xs inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span>GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchPRs}
            className="shadow-xs h-8 gap-1.5 text-xs"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="shadow-xs rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">Open PRs</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-foreground">
            {stats.open}
          </p>
        </div>
        <div className="shadow-xs rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">Closed / Merged</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-muted-foreground">
            {stats.closed}
          </p>
        </div>
        <div className="shadow-xs rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">Analyzed</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-foreground">
            {stats.analyzed}
          </p>
        </div>
        <div className="shadow-xs rounded-xl border border-border bg-card p-4">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">
            High / Critical Risk
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {stats.highRisk}
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex h-9 items-center rounded-lg border border-border bg-muted/40 p-1">
          {(["open", "closed", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStateFilter(tab)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-all",
                stateFilter === tab
                  ? "bg-card font-semibold text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pull requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg border-border bg-card pl-9 text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* PR Cards List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="shadow-xs space-y-3 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-5 w-72" />
              </div>
              <Skeleton className="h-3 w-48" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="shadow-xs mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <AlertTriangle className="mx-auto h-7 w-7 text-muted-foreground" />
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            Unable to load pull requests
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{error}</p>
          <Button
            onClick={fetchPRs}
            variant="outline"
            size="sm"
            className="mt-4 h-8 gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      ) : filteredPRs.length === 0 ? (
        <div className="shadow-xs rounded-xl border border-border bg-card p-12 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <GitPullRequest className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-foreground">No pull requests found</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            {searchQuery
              ? `No pull requests matching "${searchQuery}" in state "${stateFilter}".`
              : `There are currently no ${stateFilter} pull requests in ${owner}/${repo}.`}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <a
              href={`https://github.com/${owner}/${repo}/compare`}
              target="_blank"
              rel="noreferrer"
              className="shadow-xs inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open PR on GitHub →
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPRs.map((pr) => {
            const hasAnalysis = Boolean(pr.analysis);
            const riskLevel = pr.analysis?.riskLevel;

            return (
              <SpotlightCard
                key={pr.id}
                className="shadow-xs border-border bg-card p-5 transition-colors hover:border-foreground/20"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    {/* Status badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        #{pr.number}
                      </span>

                      {/* State Badge */}
                      {pr.state === "merged" ? (
                        <Badge variant="merged">Merged</Badge>
                      ) : pr.draft ? (
                        <Badge variant="draft">Draft</Badge>
                      ) : pr.state === "open" ? (
                        <Badge variant="open">Open</Badge>
                      ) : (
                        <Badge variant="closed">Closed</Badge>
                      )}

                      {/* Risk Badge */}
                      {hasAnalysis && riskLevel ? (
                        <Badge variant={riskLevel}>
                          Risk: {riskLevel.toUpperCase()} ({pr.analysis?.riskScore}/100)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Not analyzed
                        </Badge>
                      )}
                    </div>

                    {/* PR Title */}
                    <Link
                      href={`/dashboard/repositories/${owner}/${repo}/pulls/${pr.number}` as any}
                      className="block text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-muted-foreground"
                    >
                      {pr.title}
                    </Link>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-sans">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pr.author.avatar_url || "https://github.com/ghost.png"}
                          alt={pr.author.login}
                          className="h-4 w-4 rounded-full border border-border"
                        />
                        <span className="font-medium text-foreground">{pr.author.login}</span>
                      </div>

                      <span>•</span>
                      <span>Updated {formatRelativeTime(pr.updated_at)}</span>

                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                        <Plus className="h-3 w-3" />
                        {pr.additions}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400">
                        <Minus className="h-3 w-3" />
                        {pr.deletions}
                      </span>

                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <FileCode className="h-3 w-3" />
                        {pr.changed_files} {pr.changed_files === 1 ? "file" : "files"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2 pt-2 md:pt-0">
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open on GitHub"
                      className="shadow-xs rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <Button
                      asChild
                      size="sm"
                      variant={hasAnalysis ? "outline" : "default"}
                      className="shadow-xs h-8 gap-1.5 text-xs font-medium"
                    >
                      <Link
                        href={`/dashboard/repositories/${owner}/${repo}/pulls/${pr.number}` as any}
                      >
                        {hasAnalysis ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                            View Intelligence
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            Analyze PR
                          </>
                        )}
                      </Link>
                    </Button>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
