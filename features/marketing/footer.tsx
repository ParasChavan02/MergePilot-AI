import Link from "next/link";

import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          Copyright {new Date().getFullYear()} {siteConfig.name}. Built for engineering teams that value context.
        </p>
        <div className="flex gap-4">
          <Link href="/#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-foreground">
            Docs
          </Link>
        </div>
      </div>
    </footer>
  );
}
