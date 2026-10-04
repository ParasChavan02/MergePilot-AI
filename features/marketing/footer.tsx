import Link from "next/link";

import { MergePilotLogo } from "@/components/ui/mergepilot-logo";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          {/* Brand & Mission */}
          <div className="max-w-sm space-y-3">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <MergePilotLogo />
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              AI-powered Pull Request Intelligence platform designed for engineering teams that
              value high-signal context and confident deployments.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 text-xs">
            <div className="space-y-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
                Platform
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/#preview" className="transition-colors hover:text-foreground">
                    Product
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="transition-colors hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="transition-colors hover:text-foreground">
                    How it works
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
                Resources
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/ParasChavan02/MergePilot-AI"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <Link href="/docs" className="transition-colors hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:chavanparas0201@gmail.com"
                    className="transition-colors hover:text-foreground"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
                Legal
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <span className="cursor-default text-muted-foreground/60">Privacy</span>
                </li>
                <li>
                  <span className="cursor-default text-muted-foreground/60">Terms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-[11px] text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} MergePilot AI. All rights reserved.</p>
          <p className="font-mono text-[10px]">Deterministic Signal Engine • Gemini 2.5 Flash</p>
        </div>
      </div>
    </footer>
  );
}
