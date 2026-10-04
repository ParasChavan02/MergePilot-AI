"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/providers/theme-toggle";
import { Button } from "@/components/ui/button";
import { MergePilotLogo } from "@/components/ui/mergepilot-logo";
import { marketingNav } from "@/config/navigation";
import { getAppUrl } from "@/config/site";
import { cn } from "@/lib/utils";

function NavItem({ label, href }: { label: string; href: string }) {
  if (label === "GitHub") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label="GitHub Repository"
        title="GitHub Repository"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      </a>
    );
  }

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href as any}
      className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const loginUrl = getAppUrl("/login");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200 border-b",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md shadow-xs"
          : "border-border/40 bg-background/60 backdrop-blur-xs"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-200 md:px-8",
          scrolled ? "h-13" : "h-14"
        )}
      >
        {/* Brand */}
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
          <MergePilotLogo textClassName="whitespace-nowrap" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
            {marketingNav.map((item) => (
              <NavItem key={item.label} label={item.label} href={item.href} />
            ))}
          </nav>

          <div className="flex items-center gap-3 pl-2">
            <ThemeToggle />

            <Button asChild size="sm" className="h-8 rounded-lg px-3.5 text-xs font-medium">
              {loginUrl.startsWith("http") ? (
                <a href={loginUrl}>Get started</a>
              ) : (
                <Link href={loginUrl as any}>Get started</Link>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
              Menu
            </summary>
            <div className="absolute right-0 top-10 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl">
              {marketingNav.map((item) =>
                item.href.startsWith("http") ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {item.label === "GitHub" && (
                      <svg
                        className="h-3.5 w-3.5 fill-current"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    )}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href as any}
                    className="block rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="my-1 border-t border-border" />
              {loginUrl.startsWith("http") ? (
                <a
                  href={loginUrl}
                  className="block rounded-lg px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Get started →
                </a>
              ) : (
                <Link
                  href={loginUrl as any}
                  className="block rounded-lg px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Get started →
                </Link>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
