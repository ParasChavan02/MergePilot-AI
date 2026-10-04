"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { docsNavigation } from "./docs-nav-config";

import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function DocsSidebar({ className, onItemClick }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-full text-xs overflow-x-hidden", className)}>
      <div className="space-y-6">
        {docsNavigation.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h4 className="px-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h4>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    onClick={() => onItemClick?.()}
                    className={cn(
                      "group flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors leading-tight",
                      isActive
                        ? "bg-[#F5F5F5] font-medium text-[#111111] dark:bg-[#141414] dark:text-[#FAFAFA]"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
