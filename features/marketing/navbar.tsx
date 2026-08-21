import Link from "next/link";

import { ThemeToggle } from "@/components/providers/theme-toggle";
import { Button } from "@/components/ui/button";
import { marketingNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

function NavItem({ label, href }: { label: string; href: string }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className="transition-colors hover:text-foreground">
      {label}
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card text-sm">
            MP
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-8 text-sm text-muted-foreground">
            {marketingNav.map((item) => (
              <NavItem key={item.label} label={item.label} href={item.href} />
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <details className="relative">
            <summary className="list-none rounded-full border border-border bg-card px-3 py-2 text-sm">
              Menu
            </summary>
            <div className="absolute right-0 top-12 w-48 rounded-2xl border border-border bg-card p-2 shadow-soft">
              {marketingNav.map((item) =>
                item.href.startsWith("http") ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Link
                href="/login"
                className="mt-1 block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Login
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
