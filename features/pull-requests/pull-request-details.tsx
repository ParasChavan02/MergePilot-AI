"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileCode,
  GitBranch,
  GitCommit,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BorderBeam } from "@/components/magicui/border-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { FinalAnalysisResult } from "@/server/ai/schemas";
import type { PullRequestContext } from "@/server/github/types";

interface PullRequestDetailsProps {
  owner: string;
  repo: string;
  prNumber: number;
}

export function PullRequestDetails({ owner, repo, prNumber }: PullRequestDetailsProps) {
  const [context, setContext] = useState<PullRequestContext | null>(null);
  const [analysis, setAnalysis] = useState<FinalAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

  const fetchPRDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/repos/${owner}/${repo}/pulls/${prNumber}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load pull request details");
      }

      setContext(data.context);
      if (data.storedAnalysis) {
        setAnalysis(data.storedAnalysis);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pull request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, repo, prNumber]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/repos/${owner}/${repo}/pulls/${prNumber}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze pull request");
      }

      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyReleaseNotes = () => {
    if (!analysis?.releaseNotes) return;
    navigator.clipboard.writeText(analysis.releaseNotes);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const toggleFile = (filename: string) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [filename]: !prev[filename]
    }));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="shadow-xs rounded-2xl border border-border bg-card p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !context) {
    return (
      <div className="shadow-xs mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <AlertTriangle className="mx-auto h-7 w-7 text-muted-foreground" />
        <h3 className="mt-3 text-sm font-semibold text-foreground">Error Loading PR Details</h3>
        <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        <Button
          onClick={fetchPRDetails}
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

  if (!context) return null;

  const { pullRequest } = context;
  const isMerged = pullRequest.state === "merged";

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-rose-600 dark:text-rose-400";
    if (score >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-rose-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/repositories/${owner}/${repo}/pulls` as any}
            className="inline-flex items-center gap-1 font-sans text-xs transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Pull Requests</span>
          </Link>
          <span className="text-border">/</span>
          <span className="truncate">{owner}</span>
          <span className="text-border">/</span>
          <span className="truncate">{repo}</span>
          <span className="text-border">/</span>
          <span className="font-bold text-foreground">#{prNumber}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={pullRequest.html_url}
            target="_blank"
            rel="noreferrer"
            className="shadow-xs inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span>Open on GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* PR Header Banner */}
      <div className="shadow-xs rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-muted-foreground">
                #{pullRequest.number}
              </span>

              {isMerged ? (
                <Badge variant="merged">Merged</Badge>
              ) : pullRequest.draft ? (
                <Badge variant="draft">Draft</Badge>
              ) : pullRequest.state === "open" ? (
                <Badge variant="open">Open</Badge>
              ) : (
                <Badge variant="closed">Closed</Badge>
              )}

              {analysis && (
                <Badge variant={analysis.risk.level} className="font-mono text-[10px] uppercase">
                  Risk: {analysis.risk.level} ({analysis.risk.score}/100)
                </Badge>
              )}

              {context.contextTruncated && (
                <Badge
                  variant="outline"
                  className="border-amber-500/30 text-[10px] text-amber-700 dark:text-amber-300"
                >
                  Large PR (Diff Budgeted)
                </Badge>
              )}
            </div>

            <h1 className="break-words text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {pullRequest.title}
            </h1>

            {/* Author and Branch Info */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pullRequest.author.avatar_url || "https://github.com/ghost.png"}
                  alt={pullRequest.author.login}
                  className="h-4 w-4 rounded-full border border-border"
                />
                <span className="font-medium text-foreground">{pullRequest.author.login}</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[11px]">
                <GitBranch className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{pullRequest.base.ref}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
                <span className="font-medium text-foreground">{pullRequest.head.ref}</span>
              </div>

              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Created {formatRelativeTime(pullRequest.created_at)}
              </span>

              <span>•</span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  +{context.statistics.totalAdditions}
                </span>
                <span className="font-medium text-rose-600 dark:text-rose-400">
                  -{context.statistics.totalDeletions}
                </span>
                <span className="text-muted-foreground">
                  in {context.statistics.totalChangedFiles} files
                </span>
              </div>
            </div>
          </div>

          {/* Analyze / Re-analyze CTA */}
          <div className="shrink-0 pt-2 lg:pt-0">
            {analysis ? (
              <Button
                onClick={runAnalysis}
                disabled={analyzing}
                variant="outline"
                size="sm"
                className="shadow-xs h-9 gap-2 text-xs"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Re-analyzing PR...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Re-analyze PR</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={runAnalysis}
                disabled={analyzing}
                className="shadow-xs h-9 gap-2 bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing Intelligence...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Analyze PR</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between rounded-xl border p-4 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={runAnalysis} variant="ghost" size="sm" className="h-7 text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="intelligence" className="space-y-6">
        <div className="scrollbar-none overflow-x-auto pb-1">
          <TabsList className="h-10 w-full min-w-max justify-start rounded-xl border border-border bg-muted/40 p-1">
            <TabsTrigger
              value="intelligence"
              className="data-[state=active]:shadow-xs gap-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              Intelligence Suite
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="data-[state=active]:shadow-xs gap-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <FileCode className="h-3.5 w-3.5 text-muted-foreground" />
              Changed Files ({context.changedFiles.length})
            </TabsTrigger>
            <TabsTrigger
              value="commits"
              className="data-[state=active]:shadow-xs gap-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <GitCommit className="h-3.5 w-3.5 text-muted-foreground" />
              Commits ({context.commits.length})
            </TabsTrigger>
            <TabsTrigger
              value="description"
              className="data-[state=active]:shadow-xs gap-2 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              PR Description
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: AI Intelligence Suite */}
        <TabsContent value="intelligence" className="space-y-6">
          {!analysis ? (
            /* Empty Intelligence State */
            <div className="shadow-xs relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
              <BorderBeam size={220} duration={14} colorFrom="#888888" colorTo="#444444" />
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                Pull Request Intelligence Engine
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
                MergePilot analyzes code diffs, security boundaries, database migrations, and
                breaking contract changes to determine architectural risk before you merge.
              </p>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={runAnalysis}
                  disabled={analyzing}
                  size="default"
                  className="shadow-xs gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating PR Intelligence...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Run Intelligence Analysis</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="mx-auto mt-8 grid max-w-2xl gap-4 border-t border-border pt-6 text-left sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
                    Risk Scoring
                  </p>
                  <p className="text-[11px] leading-normal text-muted-foreground">
                    Deterministic code signals blended with AI reasoning to identify high-risk
                    changes.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                    Breaking Changes
                  </p>
                  <p className="text-[11px] leading-normal text-muted-foreground">
                    Detects removed API fields, altered database columns, and breaking contract
                    signatures.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Test Gap Audit
                  </p>
                  <p className="text-[11px] leading-normal text-muted-foreground">
                    Flags business logic and security changes lacking accompanying test assertions.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Render Full Structured Intelligence */
            <div className="space-y-6">
              {/* Analyzed Timestamp Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Analyzed {formatRelativeTime(analysis.metadata.analyzedAt)} with{" "}
                    <strong className="text-foreground">{analysis.metadata.model}</strong>
                  </span>
                </span>
                {analysis.metadata.contextTruncated && (
                  <span className="text-[11px] text-amber-600 dark:text-amber-400">
                    Context truncated: Prioritized changed files and metadata
                  </span>
                )}
              </div>

              {/* 1. Summary Card */}
              <Card className="shadow-xs border-border bg-card text-card-foreground">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Engineering Digest
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs leading-relaxed text-foreground sm:text-sm">
                    {analysis.summary}
                  </p>
                </CardContent>
              </Card>

              {/* 2. Risk Intelligence Card */}
              <Card className="shadow-xs border-border bg-card text-card-foreground">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Risk Intelligence
                      </CardTitle>
                    </div>
                    <Badge
                      variant={analysis.risk.level}
                      className="px-2.5 py-0.5 font-mono text-xs uppercase"
                    >
                      {analysis.risk.level} RISK
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-muted-foreground">Composite Risk Score</span>
                      <span className={cn("text-sm font-bold", getRiskColor(analysis.risk.score))}>
                        {analysis.risk.score} / 100
                      </span>
                    </div>
                    <Progress
                      value={analysis.risk.score}
                      indicatorClassName={getProgressColor(analysis.risk.score)}
                      className="h-2 bg-muted"
                    />
                  </div>

                  {/* Risk Reasons */}
                  <div className="space-y-2 pt-1">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Identified Risk Factors:
                    </p>
                    <ul className="space-y-2">
                      {analysis.risk.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                          <span className="leading-relaxed">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Grid for Key Changes and Breaking Changes */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Key Changes */}
                <Card className="shadow-xs border-border bg-card text-card-foreground">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      Key Modifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {analysis.keyChanges.map((change, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-foreground">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-[10px] font-semibold text-foreground">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Breaking Changes */}
                <Card
                  className={cn(
                    "border-border bg-card text-card-foreground shadow-xs",
                    analysis.breakingChanges.detected && "border-rose-500/30"
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <AlertTriangle
                          className={cn(
                            "h-4 w-4",
                            analysis.breakingChanges.detected
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-muted-foreground"
                          )}
                        />
                        Breaking Changes
                      </CardTitle>
                      {analysis.breakingChanges.detected ? (
                        <Badge variant="critical">Detected</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          None Detected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {analysis.breakingChanges.detected &&
                    analysis.breakingChanges.items.length > 0 ? (
                      <div className="space-y-3">
                        {analysis.breakingChanges.items.map((item, i) => (
                          <div
                            key={i}
                            className="space-y-1 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs"
                          >
                            <span className="font-mono font-semibold text-rose-700 dark:text-rose-300">
                              {item.area}
                            </span>
                            <p className="text-foreground">{item.reason}</p>
                            <p className="text-[11px] text-muted-foreground">
                              <strong>Impact:</strong> {item.potentialImpact}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        No backward compatibility breaks, removed fields, or contract alterations
                        were identified in this pull request.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 4. Test Gaps & Verification Recommendations */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Test Gaps */}
                <Card className="shadow-xs border-border bg-card text-card-foreground">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        Test Gap Analysis
                      </CardTitle>
                      {analysis.testGaps.length > 0 ? (
                        <Badge variant="medium">{analysis.testGaps.length} Gaps Found</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Adequate Coverage
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {analysis.testGaps.length > 0 ? (
                      <div className="space-y-3">
                        {analysis.testGaps.map((gap, i) => (
                          <div
                            key={i}
                            className="space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs"
                          >
                            <p className="font-semibold text-amber-800 dark:text-amber-300">
                              {gap.test}
                            </p>
                            <p className="text-foreground">{gap.reason}</p>
                            <p className="text-[11px] text-muted-foreground">
                              <strong>Suggested Verification:</strong> {gap.suggestedVerification}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        No critical test gaps were detected for the changes in this pull request.
                        Existing tests or test additions appear proportional to the risk.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Engineering Recommendations */}
                <Card className="shadow-xs border-border bg-card text-card-foreground">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Terminal className="h-4 w-4" />
                      Verification Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* 5. Release Notes Draft Card */}
              <Card className="shadow-xs border-border bg-card text-card-foreground">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <FileCode className="h-4 w-4" />
                      Draft Release Notes
                    </CardTitle>

                    <Button
                      onClick={handleCopyReleaseNotes}
                      variant="outline"
                      size="sm"
                      className="shadow-xs h-8 gap-1.5 text-xs font-medium"
                    >
                      {copiedNotes ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Release Notes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground shadow-inner">
                    {analysis.releaseNotes ||
                      "No release notes draft generated for this pull request."}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Changed Files */}
        <TabsContent value="files" className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
            <span>
              Showing {context.changedFiles.length} changed files with +
              {context.statistics.totalAdditions} / -{context.statistics.totalDeletions} lines
            </span>
          </div>

          <div className="space-y-2.5">
            {context.changedFiles.map((file) => {
              const isExpanded = Boolean(expandedFiles[file.filename]);

              return (
                <div
                  key={file.filename}
                  className="shadow-xs overflow-hidden rounded-xl border border-border bg-card"
                >
                  <button
                    type="button"
                    onClick={() => toggleFile(file.filename)}
                    className="flex w-full items-center justify-between p-3.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="truncate font-mono text-xs font-medium text-foreground">
                        {file.filename}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        +{file.additions}
                      </span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        -{file.deletions}
                      </span>
                      <Badge variant="outline" className="font-sans text-[10px] uppercase">
                        {file.status}
                      </Badge>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="overflow-x-auto border-t border-border bg-muted/30 p-3">
                      {file.patch ? (
                        <pre className="font-mono text-[11px] leading-relaxed">
                          {file.patch.split("\n").map((line, lIdx) => {
                            let lineClass = "text-muted-foreground";
                            if (line.startsWith("+") && !line.startsWith("+++")) {
                              lineClass =
                                "text-emerald-800 bg-emerald-500/10 dark:text-emerald-300 dark:bg-emerald-500/15";
                            } else if (line.startsWith("-") && !line.startsWith("---")) {
                              lineClass =
                                "text-rose-800 bg-rose-500/10 dark:text-rose-300 dark:bg-rose-500/15";
                            } else if (line.startsWith("@@")) {
                              lineClass = "text-muted-foreground bg-muted font-semibold px-1";
                            }

                            return (
                              <div key={lIdx} className={cn("rounded-sm px-2 py-0.5", lineClass)}>
                                {line}
                              </div>
                            );
                          })}
                        </pre>
                      ) : (
                        <p className="text-xs italic text-muted-foreground">
                          Binary or patch diff not displayed.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 3: Commits */}
        <TabsContent value="commits" className="space-y-2.5">
          {context.commits.map((commit) => (
            <div
              key={commit.sha}
              className="shadow-xs flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5 text-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium tracking-tight text-foreground">{commit.message}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{commit.author.name}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(commit.author.date)}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 font-mono">
                <a
                  href={commit.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {commit.sha.slice(0, 7)}
                </a>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Tab 4: PR Description */}
        <TabsContent value="description">
          <Card className="shadow-xs border-border bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Original GitHub PR Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {context.description && context.description.trim().length > 0 ? (
                <div className="whitespace-pre-wrap rounded-xl border border-border bg-muted/30 p-4 font-sans text-xs leading-relaxed text-foreground">
                  {context.description}
                </div>
              ) : (
                <p className="text-xs italic text-muted-foreground">
                  No PR description provided on GitHub.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
