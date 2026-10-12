"use client";

import {
  BookOpen,
  FileCode,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  Sliders,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDashboardSidebar } from "./dashboard-shell";

import { logout } from "@/actions/auth";
import { MergePilotLogo } from "@/components/ui/mergepilot-logo";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Repositories", href: "/dashboard/repositories", icon: FolderGit2 },
  { label: "Analyses", href: "/dashboard/analyses", icon: Zap },
  { label: "Release Notes", href: "/dashboard/release-notes", icon: FileCode },
  { label: "Settings", href: "/dashboard/settings", icon: Sliders }
];

export function DashboardSidebar({ userName }: Readonly<{ userName: string }>) {
  const pathname = usePathname();
  const { collapsed, toggleSidebar } = useDashboardSidebar();

  // Extract initials (e.g. Paras -> PA)
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (collapsed) {
    return null;
  }

  return (
    <aside className="sticky top-3 my-3 ml-3 hidden h-fit max-h-[calc(100vh-1.5rem)] w-60 shrink-0 flex-col rounded-2xl border border-border bg-card p-3.5 shadow-sm backdrop-blur-md lg:flex">
      {/* Brand Header + ChatGPT Collapse Toggle */}
      <div className="flex items-center justify-between border-b border-border/60 px-1 pb-3">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <MergePilotLogo textClassName="text-xs" />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/docs"
            className="flex items-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Documentation"
          >
            <BookOpen className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex items-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="mt-3 space-y-1">
        <p className="px-2.5 py-1 text-[11px] font-medium text-muted-foreground/70">Platform</p>

        {/* Navigation Items (ChatGPT Pills) */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href as any}
                className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground/70 group-hover:text-foreground"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Compact User Profile Section */}
      <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
            {initials || "PA"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">{userName}</p>
            <p className="text-[10px] text-muted-foreground">Connected via GitHub</p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
