"use client";

import { FileCode, FolderGit2, LayoutDashboard, LogOut, Menu, Sliders, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logout } from "@/actions/auth";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { MergePilotLogo } from "@/components/ui/mergepilot-logo";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Repositories", href: "/dashboard/repositories", icon: FolderGit2 },
  { label: "Analyses", href: "/dashboard/analyses", icon: Zap },
  { label: "Release Notes", href: "/dashboard/release-notes", icon: FileCode },
  { label: "Settings", href: "/dashboard/settings", icon: Sliders }
];

export function DashboardTopbar({ userName }: Readonly<{ userName: string }>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="border-b border-border bg-background/80 backdrop-blur-md dark:border-[#1A1A1A]">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          {/* Mobile Menu Button & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center lg:hidden">
              <MergePilotLogo />
            </div>

            {/* Desktop breadcrumb context */}
            <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
              <span>Signed in as</span>
              <span className="font-medium text-foreground">{userName}</span>
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <form action={logout} className="hidden lg:block">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex w-72 flex-col justify-between border-r border-border bg-card p-5 shadow-2xl dark:border-[#262626] dark:bg-[#0A0A0A]">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <MergePilotLogo />

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Items */}
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
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? "border-l-2 border-foreground bg-muted pl-2.5 font-semibold text-foreground dark:bg-[#111111]"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground dark:hover:bg-[#111111]/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Profile and Logout */}
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
          </div>
        </div>
      )}
    </>
  );
}
