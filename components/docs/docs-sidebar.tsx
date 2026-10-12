"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Bug,
  FileCode,
  FileText,
  History,
  Layers,
  LayoutDashboard,
  Milestone,
  Rocket,
  ShieldAlert,
  Sliders,
  Sparkles,
  Terminal,
  Workflow
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import { docsNavigation } from "./docs-nav-config";

import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  className?: string;
  onItemClick?: () => void;
}

// ChatGPT-style iconography for each docs article
const itemIcons: Record<string, ComponentType<{ className?: string }>> = {
  "/docs/introduction": BookOpen,
  "/docs/quick-start": Rocket,
  "/docs/how-it-works": Workflow,
  "/docs/features/ai-summary": Sparkles,
  "/docs/features/risk-analysis": ShieldAlert,
  "/docs/features/test-gaps": Bug,
  "/docs/features/breaking-changes": AlertTriangle,
  "/docs/features/release-notes": FileCode,
  "/docs/architecture": Layers,
  "/docs/configuration": Sliders,
  "/docs/api": Terminal,
  "/docs/changelog": History,
  "/docs/roadmap": Milestone
};

export function DocsSidebar({ className, onItemClick }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-full flex-col text-[13px] text-foreground overflow-x-hidden selection:bg-neutral-200 dark:selection:bg-[#212121]",
        className
      )}
    >
      {/* Quick Action (ChatGPT "New Chat" Style) */}
      <div className="mb-4">
        <Link
          href="/dashboard"
          onClick={() => onItemClick?.()}
          className="group flex w-full items-center justify-between rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-border hover:bg-neutral-100 hover:text-foreground dark:border-[#212121] dark:bg-[#111111] dark:hover:bg-[#1a1a1a]"
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            <span>Open Dashboard</span>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="space-y-4">
        {docsNavigation.map((section) => (
          <div key={section.title} className="space-y-0.5">
            {/* ChatGPT-style Muted Header */}
            <h4 className="px-2.5 py-1 text-[11px] font-medium tracking-normal text-muted-foreground/70">
              {section.title}
            </h4>

            {/* Section Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = itemIcons[item.href] || FileText;

                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    onClick={() => onItemClick?.()}
                    className={cn(
                      "group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] transition-colors",
                      isActive
                        ? "bg-neutral-200/90 font-medium text-neutral-900 dark:bg-[#212121] dark:text-[#ECECEC]"
                        : "text-muted-foreground hover:bg-neutral-100 hover:text-foreground dark:text-[#9B9B9B] dark:hover:bg-[#171717] dark:hover:text-[#ECECEC]"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-neutral-900 dark:text-[#ECECEC]"
                            : "text-muted-foreground/70 group-hover:text-foreground dark:text-zinc-500 dark:group-hover:text-zinc-300"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>

                    {item.badge && (
                      <span className="shrink-0 rounded bg-muted/80 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
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

      {/* ChatGPT-style Bottom Profile / App Pill */}
      <div className="mt-8 border-t border-border/60 pt-4 dark:border-[#212121]">
        <Link
          href="/dashboard"
          onClick={() => onItemClick?.()}
          className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-neutral-100 dark:hover:bg-[#171717]"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-900">
            MP
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">MergePilot AI</p>
            <p className="text-[10px] text-muted-foreground">Docs & Reference</p>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </aside>
  );
}
