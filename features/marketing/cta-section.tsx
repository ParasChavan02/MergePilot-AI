import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Ready when you are</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Build confidence into every merge.
          </h2>
          <p className="mt-4 text-muted-foreground">
            The MVP foundation is in place: landing page, login flow, protected dashboard shell,
            strict configuration, and the database schema to support PR intelligence.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/login">Start with GitHub</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
