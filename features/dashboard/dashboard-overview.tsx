"use client";

import {
  AlertTriangle,
  ArrowRight,
  FolderGit2,
  GitPullRequest,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { SpotlightCard } from "@/components/magicui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";

interface DashboardData {
  stats: {
    repositoriesCount: number;
    openPrsCount: number;
    analyzedPrsCount: number;
    highRiskCount: number;
  };
  analyses: Array<{
    id: string;
    repository: {
      fullName: string;
      name: string;
    };
    pullRequest: {
      number: number;
      title: string;
      state: string;
      authorLogin: string;
    };
    risk: {
      level: "low" | "medium" | "high" | "critical";
      score: number;
      reasons: string[];
    };
    summary: string;
    breakingChangesCount: number;
    testGapsCount: number;
    analyzedAt: string;
  }>;
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analysis?limit=10");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load dashboard data");
      }

      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]"
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-14" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-44" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="space-y-2 rounded-xl border border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]"
              >
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center dark:border-[#262626] dark:bg-[#0A0A0A]">
        <AlertTriangle className="mx-auto h-7 w-7 text-muted-foreground" />
        <h3 className="mt-3 text-sm font-semibold text-foreground">
          Unable to load dashboard intelligence
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{error || "Unknown error occurred"}</p>
        <Button
          onClick={fetchDashboardData}
          variant="outline"
          size="sm"
          className="mt-4 h-8 gap-1.5 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      </div>
    );
  }

  const { stats, analyses } = data;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Intelligence Overview
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Real-time metrics, risk scoring, and intelligence across your connected repositories.
        </p>
      </div>

      {/* Monochrome Statistics Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Repositories */}
        <SpotlightCard className="border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider">
              Repositories
            </span>
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-foreground">
            <NumberTicker value={stats.repositoriesCount} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Connected GitHub repositories</p>
        </SpotlightCard>

        {/* Open PRs */}
        <SpotlightCard className="border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider">
              Open PRs
            </span>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-foreground">
            <NumberTicker value={stats.openPrsCount} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Pending review & merge</p>
        </SpotlightCard>

        {/* Analyzed PRs */}
        <SpotlightCard className="border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider">
              Analyzed
            </span>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-foreground">
            <NumberTicker value={stats.analyzedPrsCount} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">AI Intelligence generated</p>
        </SpotlightCard>

        {/* High Risk PRs */}
        <SpotlightCard className="border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider">
              High Risk
            </span>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-foreground">
            <NumberTicker value={stats.highRiskCount} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Requiring extra review</p>
        </SpotlightCard>
      </div>

      {/* Quick Navigation Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]">
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FolderGit2 className="h-4 w-4 text-muted-foreground" />
              Repository Intelligence
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Explore your connected GitHub repositories, inspect open pull requests, and trigger
              deep architectural risk reviews.
            </p>
          </div>
          <div className="mt-4">
            <Button asChild size="sm" variant="secondary" className="h-8 text-xs font-medium">
              <Link href="/dashboard/repositories">
                <span>Browse Repositories</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]">
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Automated Release Notes
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              View and copy ready-to-ship release notes compiled automatically from analyzed pull
              request diffs and changes.
            </p>
          </div>
          <div className="mt-4">
            <Button asChild size="sm" variant="outline" className="h-8 text-xs font-medium">
              <Link href="/dashboard/release-notes">
                <span>View Release Notes</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Analyses Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Recent Pull Request Analyses
            </h2>
            <p className="text-xs text-muted-foreground">
              Latest architectural evaluations across your repositories
            </p>
          </div>

          {analyses.length > 0 && (
            <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <Link href="/dashboard/analyses">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>

        {analyses.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center dark:border-[#262626] dark:bg-[#0A0A0A]">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground dark:border-[#262626] dark:bg-[#111111]">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              No pull requests analyzed yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
              Select any connected repository and run your first intelligence analysis on an active
              pull request.
            </p>
            <div className="mt-5 flex justify-center">
              <Button asChild size="sm" className="h-8 text-xs">
                <Link href="/dashboard/repositories">Select Repository →</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((item) => (
              <SpotlightCard
                key={item.id}
                className="border-border bg-card p-5 transition-colors hover:border-foreground/20 dark:border-[#262626] dark:bg-[#0A0A0A] dark:hover:border-zinc-700"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.repository.fullName}
                      </span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        #{item.pullRequest.number}
                      </span>
                      <Badge variant={item.risk.level} className="font-mono text-[10px] uppercase">
                        Risk: {item.risk.level} ({item.risk.score}/100)
                      </Badge>
                      {item.breakingChangesCount > 0 && (
                        <Badge variant="critical" className="text-[10px]">
                          {item.breakingChangesCount} Breaking
                        </Badge>
                      )}
                      {item.testGapsCount > 0 && (
                        <Badge variant="medium" className="text-[10px]">
                          {item.testGapsCount} Test Gap{item.testGapsCount > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>

                    <Link
                      href={
                        `/dashboard/repositories/${item.repository.fullName}/pulls/${item.pullRequest.number}` as any
                      }
                      className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
                    >
                      {item.pullRequest.title}
                    </Link>

                    <p className="line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 pt-2 md:pt-0">
                    <span className="text-[11px] text-muted-foreground">
                      {formatRelativeTime(item.analyzedAt)}
                    </span>

                    <Button asChild size="sm" variant="outline" className="h-8 text-xs font-medium">
                      <Link
                        href={
                          `/dashboard/repositories/${item.repository.fullName}/pulls/${item.pullRequest.number}` as any
                        }
                      >
                        Inspect →
                      </Link>
                    </Button>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
