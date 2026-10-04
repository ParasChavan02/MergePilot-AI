"use client";

import { FileCode, FolderGit2, LayoutDashboard, LogOut, Sliders, Zap } from "lucide-react";
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

  return (
    <aside className="hidden w-64 shrink-0 justify-between border-r border-border bg-card/50 p-5 dark:border-[#1A1A1A] dark:bg-[#050505] lg:flex lg:flex-col">
      <div className="space-y-6">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center px-1 transition-opacity hover:opacity-90"
        >
          <MergePilotLogo />
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
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
                className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "border-l-2 border-foreground bg-muted pl-2.5 font-semibold text-foreground dark:bg-[#111111]"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground dark:hover:bg-[#111111]/50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout pinned at bottom */}
      <div className="space-y-3 border-t border-border pt-4 dark:border-[#1A1A1A]">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-foreground">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">{userName}</p>
            <p className="font-mono text-[10px] text-muted-foreground">Connected</p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
