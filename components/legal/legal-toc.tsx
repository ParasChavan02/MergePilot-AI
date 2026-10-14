"use client";

import { ChevronDown, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface LegalTocItem {
  id: string;
  title: string;
  number?: string;
}

interface LegalTocProps {
  items: LegalTocItem[];
  className?: string;
}

export function LegalToc({ items, className }: LegalTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0.1 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const activeItem = items.find((item) => item.id === activeId) || items[0];

  return (
    <>
      {/* Mobile quick-jump navigation accordion */}
      <div className="mb-8 block rounded-xl border border-border bg-card p-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between text-left text-xs font-medium text-foreground"
          aria-expanded={mobileOpen}
        >
          <span className="flex items-center gap-2">
            <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Table of Contents:</span>
            <span className="max-w-[180px] truncate font-semibold text-foreground sm:max-w-xs">
              {activeItem?.title}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              mobileOpen && "rotate-180"
            )}
          />
        </button>

        {mobileOpen && (
          <nav className="mt-3 space-y-1 border-t border-border/60 pt-3">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {item.number && (
                    <span className="font-mono text-[11px] text-muted-foreground/70">
                      {item.number}
                    </span>
                  )}
                  <span className="truncate">{item.title}</span>
                </a>
              );
            })}
          </nav>
        )}
      </div>

      {/* Desktop sticky sidebar TOC */}
      <aside className={cn("hidden w-64 shrink-0 lg:block", className)}>
        <div className="backdrop-blur-xs sticky top-24 space-y-3 rounded-xl border border-border/60 bg-card/50 p-4">
          <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <ListFilter className="h-3.5 w-3.5" />
            <span>Table of Contents</span>
          </div>

          <nav className="scrollbar-thin max-h-[calc(100vh-10rem)] space-y-1 overflow-y-auto pr-1">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "group flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs transition-all",
                    isActive
                      ? "bg-muted font-semibold text-foreground shadow-2xs"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  {item.number && (
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 font-mono text-[10px]",
                        isActive ? "text-foreground font-bold" : "text-muted-foreground/70"
                      )}
                    >
                      {item.number}
                    </span>
                  )}
                  <span className="leading-snug">{item.title}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
