"use client";

import { ExternalLink, FolderGit2, GitFork, Lock, RefreshCw, Search, Star } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { SpotlightCard } from "@/components/magicui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { GitHubRepository } from "@/server/github/types";

interface RepositoryError {
  message: string;
  code?: string;
}

export function RepositoryList() {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [error, setError] = useState<RepositoryError | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const fetchRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/github/repos");
      const data = await res.json();

      if (!res.ok) {
        const err: RepositoryError = {
          message: data.error || "Failed to load repositories",
          code: data.code
        };
        throw err;
      }

      setRepositories(data.repositories || []);
    } catch (err: any) {
      setError({
        message: err.message || "An unexpected error occurred while fetching repositories",
        code: err.code
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const languages = useMemo(() => {
    const set = new Set<string>();
    repositories.forEach((repo) => {
      if (repo.language) set.add(repo.language);
    });
    return Array.from(set).sort();
  }, [repositories]);

  const filteredRepositories = useMemo(() => {
    return repositories.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLang = selectedLanguage === "all" || repo.language === selectedLanguage;

      return matchesSearch && matchesLang;
    });
  }, [repositories, searchQuery, selectedLanguage]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="shadow-xs space-y-3 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const isExpired =
      error.message.toLowerCase().includes("expired") || error.code === "GITHUB_CONNECTION_EXPIRED";

    return (
      <div className="shadow-xs mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
          <FolderGit2 className="h-5 w-5" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-foreground">
          {isExpired ? "GitHub Connection Expired" : "Unable to load repositories"}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {isExpired
            ? "Your GitHub session token is invalid or has expired. Please sign in again to refresh your connection."
            : error.message}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {isExpired ? (
            <>
              <Button
                size="sm"
                disabled={reconnecting}
                onClick={async () => {
                  try {
                    setReconnecting(true);
                    await signIn("github", { callbackUrl: "/dashboard/repositories" });
                  } catch {
                    setReconnecting(false);
                  }
                }}
                className="shadow-xs gap-1.5 text-xs font-medium"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", reconnecting && "animate-spin")} />
                {reconnecting ? "Redirecting to GitHub..." : "Reconnect GitHub"}
              </Button>
              <Button
                onClick={fetchRepositories}
                variant="outline"
                size="sm"
                className="shadow-xs h-8 gap-1.5 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try Again
              </Button>
            </>
          ) : (
            <Button
              onClick={fetchRepositories}
              variant="outline"
              size="sm"
              className="shadow-xs h-8 gap-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg border-border bg-card pl-9 text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          {languages.length > 0 && (
            <select
              aria-label="Filter by language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:border-foreground/40 focus:outline-none"
            >
              <option value="all">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={fetchRepositories}
            title="Refresh repositories"
            aria-label="Refresh repositories"
            className="shadow-xs flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Repositories Grid */}
      {filteredRepositories.length === 0 ? (
        <div className="shadow-xs rounded-2xl border border-border bg-card p-12 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-foreground">No repositories found</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            {searchQuery
              ? `No repositories matched "${searchQuery}".`
              : "No repositories were found in your connected GitHub account."}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage("all");
              }}
              className="shadow-xs mt-4 h-8 text-xs"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepositories.map((repo) => (
            <SpotlightCard
              key={repo.id}
              className="shadow-xs flex flex-col justify-between border-border bg-card p-5 transition-colors hover:border-foreground/20"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={repo.owner.avatar_url || "https://github.com/ghost.png"}
                      alt={repo.owner.login}
                      className="h-5 w-5 shrink-0 rounded-full border border-border"
                    />
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {repo.owner.login}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {repo.private ? (
                      <Badge variant="outline" className="gap-1 px-1.5 py-0 text-[10px]">
                        <Lock className="h-2.5 w-2.5" />
                        Private
                      </Badge>
                    ) : (
                      <Badge variant="default" className="px-1.5 py-0 text-[10px]">
                        Public
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
                  {repo.name}
                </h3>

                {/* Description */}
                <p className="line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-muted-foreground">
                  {repo.description || "No repository description provided."}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs text-muted-foreground">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5 text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 text-muted-foreground" />
                    {repo.stargazers_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="h-3 w-3 text-muted-foreground" />
                    {repo.forks_count}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-3.5">
                <span className="text-[11px] text-muted-foreground">
                  {formatRelativeTime(repo.updated_at)}
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${repo.full_name} on GitHub`}
                    className="shadow-xs rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="shadow-xs h-7 text-xs font-medium"
                  >
                    <Link
                      href={`/dashboard/repositories/${repo.owner.login}/${repo.name}/pulls` as any}
                    >
                      View PRs →
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
