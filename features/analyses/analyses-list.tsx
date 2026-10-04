"use client";

import { AlertTriangle, FolderGit2, RefreshCw, Search, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SpotlightCard } from "@/components/magicui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";

interface AnalysisItem {
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
}

export function AnalysesList() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "critical" | "high" | "medium" | "low">(
    "all"
  );

  const fetchAnalyses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analysis?limit=50");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load analyses");
      }

      setAnalyses(data.analyses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analyses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const filteredAnalyses = useMemo(() => {
    return analyses.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.repository.fullName.toLowerCase().includes(q) ||
        item.pullRequest.title.toLowerCase().includes(q) ||
        String(item.pullRequest.number).includes(q) ||
        item.summary.toLowerCase().includes(q);

      const matchesRisk = riskFilter === "all" || item.risk.level === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [analyses, searchQuery, riskFilter]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-xl border border-border bg-card p-5 dark:border-[#262626] dark:bg-[#0A0A0A]"
            >
              <Skeleton className="h-5 w-72" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive/30 bg-destructive/5 rounded-2xl border p-8 text-center">
        <AlertTriangle className="text-destructive mx-auto h-8 w-8" />
        <h3 className="mt-3 text-base font-semibold">Unable to load analyses</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button onClick={fetchAnalyses} variant="outline" size="sm" className="mt-4 gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex h-9 items-center rounded-lg border border-border bg-card p-1 dark:border-[#262626] dark:bg-[#0A0A0A]">
          {(["all", "critical", "high", "medium", "low"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRiskFilter(tab)}
              className={`rounded-md px-3 py-1 text-xs font-medium uppercase transition-all ${
                riskFilter === tab
                  ? "shadow-xs bg-primary font-semibold text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by repo, PR title, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 border-border bg-card pl-9 text-xs text-foreground placeholder:text-muted-foreground dark:border-[#262626] dark:bg-[#0A0A0A]"
          />
        </div>
      </div>

      {filteredAnalyses.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center dark:border-[#262626] dark:bg-[#0A0A0A]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground dark:border-[#262626] dark:bg-[#111111]">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            {searchQuery ? "No analyses found" : "No analyses yet"}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            {searchQuery
              ? `No analyses matched "${searchQuery}".`
              : "Select a repository and run your first Pull Request intelligence analysis."}
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="sm">
              <Link href="/dashboard/repositories">Select Repository</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnalyses.map((item) => (
            <SpotlightCard
              key={item.id}
              className="border-border bg-card p-5 transition-all duration-200 hover:border-foreground/20 dark:border-[#262626] dark:bg-[#0A0A0A] dark:hover:border-zinc-700"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <FolderGit2 className="h-3.5 w-3.5" />
                      {item.repository.fullName}
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
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
                    Analyzed {formatRelativeTime(item.analyzedAt)}
                  </span>

                  <Button asChild size="sm" variant="outline" className="h-8 text-xs font-medium">
                    <Link
                      href={
                        `/dashboard/repositories/${item.repository.fullName}/pulls/${item.pullRequest.number}` as any
                      }
                    >
                      Inspect Intelligence →
                    </Link>
                  </Button>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
}
