"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { allDocsPages } from "./docs-nav-config";

import { cn } from "@/lib/utils";

export function DocsMobileNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-14 z-30 border-b border-border/80 bg-background/95 backdrop-blur-md md:hidden">
      <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto px-4 py-2.5">
        <Link
          href="/docs"
          className={cn(
            "shrink-0 rounded-md px-2.5 py-1 text-[11px] transition-colors font-medium",
            pathname === "/docs"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          Overview
        </Link>
        {allDocsPages.map((page) => {
          const isActive = pathname === page.href;
          return (
            <Link
              key={page.href}
              href={page.href as any}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-[11px] transition-colors font-medium",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {page.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
