"use client";

import {
  BookOpen,
  FileCode,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  Sliders,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  // Extract initials (e.g. Paras -> PA, Paras Chavan -> PC)
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden w-64 shrink-0 justify-between border-r border-border bg-card/40 p-4 dark:border-[#212121] dark:bg-[#0D0D0D] lg:flex lg:flex-col">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1">
          <Link href="/dashboard" className="transition-opacity hover:opacity-90">
            <MergePilotLogo />
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground dark:hover:bg-[#1a1a1a]"
            title="Documentation"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Docs</span>
          </Link>
        </div>

        {/* Section Header (ChatGPT Style) */}
        <div className="space-y-1">
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
                      ? "bg-neutral-200/90 font-medium text-neutral-900 dark:bg-[#212121] dark:text-[#ECECEC]"
                      : "text-muted-foreground hover:bg-neutral-100 hover:text-foreground dark:text-[#9B9B9B] dark:hover:bg-[#171717] dark:hover:text-[#ECECEC]"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-neutral-900 dark:text-[#ECECEC]"
                        : "text-muted-foreground/70 group-hover:text-foreground dark:text-zinc-500 dark:group-hover:text-zinc-300"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ChatGPT-style User Profile Pinned at Bottom */}
      <div className="space-y-2 border-t border-border/60 pt-3 dark:border-[#212121]">
        <div className="flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-[#171717]">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-900">
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
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground dark:border-[#212121] dark:hover:bg-[#171717]"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
