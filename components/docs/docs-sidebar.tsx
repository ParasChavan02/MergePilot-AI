"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Bug,
  FileCode,
  FileText,
  History,
  Home,
  Layers,
  Milestone,
  PanelLeftClose,
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
import { useDocsSidebar } from "./docs-shell";

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
  const { toggleSidebar } = useDocsSidebar();

  return (
    <aside
      className={cn(
        "flex w-full flex-col text-[13px] text-foreground overflow-x-hidden selection:bg-muted",
        className
      )}
    >
      {/* Quick Action + ChatGPT Collapse Toggle */}
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/"
          onClick={() => onItemClick?.()}
          className="group flex flex-1 items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground"
        >
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            <span>Back to Home</span>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
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

      {/* Bottom Profile / App Pill */}
      <div className="mt-8 border-t border-border/60 pt-4">
        <Link
          href="/"
          onClick={() => onItemClick?.()}
          className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-muted"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
            MP
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">MergePilot AI</p>
            <p className="text-[10px] text-muted-foreground">Return to Home</p>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </aside>
  );
}
