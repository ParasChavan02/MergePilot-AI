"use client";

import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  FileCode,
  FolderGit2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";

interface ReleaseNoteItem {
  id: string;
  repositoryName: string;
  prNumber: number;
  prTitle: string;
  summary: string;
  releaseNotes: string;
  type: string;
  createdAt: string;
}

export function ReleaseNotesFeed() {
  const [notes, setNotes] = useState<ReleaseNoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/release-notes?limit=50");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load release notes");
      }

      setNotes(data.releaseNotes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load release notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-border bg-card p-6 dark:border-[#262626] dark:bg-[#0A0A0A]"
          >
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-6 w-96" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive/30 bg-destructive/5 rounded-2xl border p-8 text-center">
        <AlertTriangle className="text-destructive mx-auto h-8 w-8" />
        <h3 className="mt-3 text-base font-semibold">Unable to load release notes</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button onClick={fetchNotes} variant="outline" size="sm" className="mt-4 gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center dark:border-[#262626] dark:bg-[#0A0A0A]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground dark:border-[#262626] dark:bg-[#111111]">
          <FileCode className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No release notes generated yet
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
          Automatically compiled markdown release notes ready to publish for staging and production
          deployments.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild size="sm">
            <Link href="/dashboard/repositories">Inspect Repositories</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        const isCopied = copiedId === note.id;

        return (
          <Card
            key={note.id}
            className="border-border bg-card dark:border-[#262626] dark:bg-[#0A0A0A]"
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <FolderGit2 className="h-3 w-3 text-muted-foreground" />
                      {note.repositoryName}
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      #{note.prNumber}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {note.type}
                    </Badge>
                  </div>

                  <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                    {note.prTitle}
                  </CardTitle>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Generated {formatRelativeTime(note.createdAt)}
                  </span>

                  <Button
                    onClick={() => handleCopy(note.id, note.releaseNotes)}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 border-border text-xs font-medium hover:bg-muted"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-foreground" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Link
                      href={
                        `/dashboard/repositories/${note.repositoryName}/pulls/${note.prNumber}` as any
                      }
                      className="gap-1"
                    >
                      <span>View PR</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {note.summary && (
                <p className="border-l-2 border-border py-0.5 pl-3 text-xs italic text-muted-foreground">
                  {note.summary}
                </p>
              )}

              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground/90 dark:bg-[#050505]">
                {note.releaseNotes}
              </pre>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
