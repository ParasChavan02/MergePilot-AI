"use client";

import { Search, X, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import { searchIndex, type SearchEntry } from "./docs-nav-config";

import { cn } from "@/lib/utils";

interface DocsSearchProps {
  className?: string;
}

export function DocsSearch({ className }: DocsSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter entries
  const filtered = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 7);
    const q = query.toLowerCase().trim();
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  // Navigate on enter
  const onSelect = (entry: SearchEntry) => {
    setIsOpen(false);
    setQuery("");
    router.push(entry.href as any);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      onSelect(filtered[selectedIndex]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-8 items-center justify-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-2 sm:px-2.5 text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted/70 hover:text-foreground",
          className
        )}
        title="Search documentation (⌘K)"
        aria-label="Search documentation"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">Search docs...</span>
        <kbd className="h-4.5 hidden select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-20">
          {/* Backdrop */}
          <div
            className="backdrop-blur-xs fixed inset-0 bg-background/80 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all">
            <div className="flex items-center border-b border-border px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search documentation, features, architecture..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={onKeyDown}
                className="h-12 w-full border-0 bg-transparent text-sm text-foreground shadow-none outline-none ring-0 placeholder:text-muted-foreground focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />

              {/* Close / Clear buttons */}
              <div className="flex shrink-0 items-center gap-1.5 pl-2">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="rounded px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Clear input"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-border/80 bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title="Close search"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="scrollbar-thin max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="p-6 text-center text-xs text-muted-foreground">
                  No documentation results found for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <div className="space-y-1">
                  {filtered.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.href}
                        onClick={() => onSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors",
                          isSelected
                            ? "bg-foreground/10 text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                              {item.section}
                            </span>
                            <span className="font-medium text-foreground">{item.title}</span>
                          </div>
                          <span className="line-clamp-1 text-[11px] text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 font-mono text-[10px] text-foreground">
                            <span>Open</span>
                            <CornerDownLeft className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/80 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
              <span>Use ↑↓ to navigate</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-medium text-foreground hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
