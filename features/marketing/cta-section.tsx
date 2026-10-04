import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/config/site";

export function CtaSection() {
  const loginUrl = getAppUrl("/login");

  return (
    <section className="mx-auto max-w-6xl border-t border-border/60 px-4 py-20 md:px-8">
      <div className="rounded-2xl border border-zinc-800 bg-[#111111] p-8 shadow-2xl transition-colors dark:border-zinc-200/80 dark:bg-[#FAFAFA] md:p-12">
        <div className="max-w-2xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-600">
            Get Started
          </p>

          <h2 className="text-2xl font-extrabold tracking-tight text-white dark:text-[#050505] md:text-3xl">
            Build confidence into every merge.
          </h2>

          <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-600 md:text-sm">
            Eliminate blind merges, catch breaking interface changes, and audit test coverage before
            your code hits staging or production.
          </p>

          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="h-10 rounded-lg bg-white px-6 text-xs font-semibold text-zinc-950 shadow-md transition-colors hover:bg-zinc-200 dark:bg-[#050505] dark:text-white dark:hover:bg-zinc-800"
            >
              {loginUrl.startsWith("http") ? (
                <a href={loginUrl}>Start with GitHub</a>
              ) : (
                <Link href={loginUrl as any}>Start with GitHub</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
