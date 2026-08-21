import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:px-8 md:pt-28">
      <div className="max-w-3xl">
        <Badge>GitHub Pull Request Intelligence</Badge>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Understand Pull Requests before you merge them.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/login">Get started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          { label: "Summary", value: "One-paragraph PR digest" },
          { label: "Risk", value: "What could break in prod" },
          { label: "Release", value: "Notes ready to ship" }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-base font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
