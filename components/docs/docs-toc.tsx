"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  title: string;
  id: string;
  level?: 2 | 3;
}

interface DocsTocProps {
  items: TocItem[];
  className?: string;
}

export function DocsToc({ items, className }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string>("");

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
      { rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <aside className={cn("hidden w-56 shrink-0 text-xs xl:block", className)}>
      <div className="sticky top-20 border-l border-border/70 pl-4">
        <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <nav className="flex flex-col space-y-2">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "line-clamp-1 transition-colors hover:text-foreground",
                  item.level === 3 ? "pl-3 text-[11px]" : "text-xs",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
