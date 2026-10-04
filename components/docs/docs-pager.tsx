import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { getPrevNextPages } from "./docs-nav-config";

interface DocsPagerProps {
  currentPath: string;
}

export function DocsPager({ currentPath }: DocsPagerProps) {
  const { prev, next } = getPrevNextPages(currentPath);

  if (!prev && !next) {
    return null;
  }

  return (
    <div className="mt-12 flex flex-col gap-4 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
      {prev ? (
        <Link
          href={prev.href as any}
          className="group flex flex-1 flex-col rounded-xl border border-border/70 p-4 transition-all hover:border-foreground/30 hover:bg-muted/40"
        >
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
            <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="mt-1 text-sm font-medium text-foreground">{prev.title}</span>
        </Link>
      ) : (
        <div className="hidden sm:block sm:flex-1" />
      )}

      {next ? (
        <Link
          href={next.href as any}
          className="group flex flex-1 flex-col rounded-xl border border-border/70 p-4 text-right transition-all hover:border-foreground/30 hover:bg-muted/40"
        >
          <span className="inline-flex items-center justify-end gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
            Next
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-1 text-sm font-medium text-foreground">{next.title}</span>
        </Link>
      ) : (
        <div className="hidden sm:block sm:flex-1" />
      )}
    </div>
  );
}
