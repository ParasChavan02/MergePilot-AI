import Link from "next/link";

import { GridPattern } from "@/components/magicui/grid-pattern";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/config/site";
import { ProductPreview } from "@/features/marketing/product-preview";

export function HeroSection() {
  const loginUrl = getAppUrl("/login");

  return (
    <section className="md:pt-18 relative overflow-hidden px-4 pb-16 pt-12 md:px-8">
      {/* Subtle Background Grid Pattern */}
      <GridPattern
        width={40}
        height={40}
        className="stroke-foreground/[0.04] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      />

      <div className="relative mx-auto max-w-4xl space-y-5 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>GitHub Pull Request Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Merge pull requests with
          <span className="block font-extrabold tracking-tight text-foreground">confidence.</span>
        </h1>

        {/* Supporting text */}
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          AI-powered pull request intelligence that explains what changed, what could break, and
          what to verify before merging.
        </p>

        {/* Balanced CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="shadow-xs h-10 rounded-lg px-5 text-xs font-semibold"
          >
            {loginUrl.startsWith("http") ? (
              <a href={loginUrl}>Get started with GitHub</a>
            ) : (
              <Link href={loginUrl as any}>Get started with GitHub</Link>
            )}
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-10 rounded-lg px-5 text-xs font-medium"
          >
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
      </div>

      {/* Product Showcase (Architectural Pipeline + Interactive Console Preview) */}
      <div id="preview" className="relative mx-auto max-w-5xl scroll-mt-24 pt-12 md:pt-14">
        {/* Technical Architectural Pipeline */}
        <div className="text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Architectural Pipeline
          </p>
          <div className="backdrop-blur-xs inline-flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 p-1.5 font-mono text-xs">
            <span className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-muted-foreground transition-colors hover:text-foreground">
              Repository
            </span>
            <span className="text-[10px] text-muted-foreground/40">→</span>
            <span className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-muted-foreground transition-colors hover:text-foreground">
              Pull Request
            </span>
            <span className="text-[10px] text-muted-foreground/40">→</span>
            <span className="shadow-2xs rounded-md border border-border bg-background px-2.5 py-1 font-semibold text-foreground transition-colors hover:border-foreground/30">
              AI Summary
            </span>
            <span className="text-[10px] text-muted-foreground/40">→</span>
            <span className="shadow-2xs rounded-md border border-border bg-background px-2.5 py-1 font-semibold text-foreground transition-colors hover:border-foreground/30">
              Risk Analysis
            </span>
            <span className="text-[10px] text-muted-foreground/40">→</span>
            <span className="shadow-2xs rounded-md border border-border bg-background px-2.5 py-1 font-semibold text-foreground transition-colors hover:border-foreground/30">
              Test Gaps
            </span>
            <span className="text-[10px] text-muted-foreground/40">→</span>
            <span className="shadow-2xs rounded-md border border-border bg-background px-2.5 py-1 font-semibold text-foreground transition-colors hover:border-foreground/30">
              Release Notes
            </span>
          </div>
        </div>

        {/* Realistic Product Mockup */}
        <div className="mt-8">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
