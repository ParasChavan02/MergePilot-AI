import {
  ArrowRight,
  ExternalLink,
  Compass,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  FileText,
  Cpu,
  Settings,
  Terminal,
  Map,
  History
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Documentation",
  description: "Understand how MergePilot analyzes your pull requests."
};

interface DocsCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

function DocsCard({ title, description, href, icon: Icon, badge }: DocsCardProps) {
  return (
    <Link
      href={href as any}
      className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-all duration-150 hover:border-foreground/30 hover:bg-muted/30"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-muted/60 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
            <Icon className="h-4 w-4" />
          </div>
          {badge && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        <h3 className="mt-4 text-sm font-medium text-foreground transition-colors group-hover:text-foreground">
          {title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="mt-4 flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
        <span>Read guide</span>
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="border-b border-border/60 pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          MergePilot AI Documentation
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Documentation
        </h1>

        <p className="mt-2 text-base font-normal text-muted-foreground sm:text-lg">
          Understand how MergePilot analyzes your pull requests.
        </p>

        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Everything you need to connect GitHub, analyze pull requests, inspect deterministic risk
          signals, evaluate breaking changes, and understand the intelligence behind MergePilot.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild size="sm" className="h-8 rounded-lg px-3.5 text-xs font-medium">
            <Link href="/docs/quick-start">
              Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 rounded-lg px-3.5 text-xs font-medium"
          >
            <a
              href="https://github.com/ParasChavan02/MergePilot-AI"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Getting Started */}
      <section className="space-y-4">
        <div>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Getting Started
          </h2>
          <p className="text-xs text-muted-foreground">
            Essential guides to set up and understand the platform workflow.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocsCard
            title="Introduction"
            description="Learn what MergePilot is and how it fits into the pull request review workflow."
            href="/docs/introduction"
            icon={Compass}
          />
          <DocsCard
            title="Quick Start"
            description="Connect GitHub and analyze your first pull request in under five minutes."
            href="/docs/quick-start"
            icon={ArrowRight}
          />
          <DocsCard
            title="How It Works"
            description="Understand the MergePilot deterministic signal and AI intelligence pipeline."
            href="/docs/how-it-works"
            icon={Cpu}
          />
        </div>
      </section>

      {/* Core Features */}
      <section className="space-y-4">
        <div>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Core Features
          </h2>
          <p className="text-xs text-muted-foreground">
            Deep dive into the 5 core intelligence layers generated for each pull request.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocsCard
            title="AI Summary"
            description="High-signal architectural explanation of changes, blast radius, and system intent."
            href="/docs/features/ai-summary"
            icon={Sparkles}
          />
          <DocsCard
            title="Risk Analysis"
            description="Deterministic code signals blended with AI contextual reasoning to score merge risk."
            href="/docs/features/risk-analysis"
            icon={ShieldAlert}
          />
          <DocsCard
            title="Test Gap Detection"
            description="Identifies untested sensitive logic, migrations, or auth changes with verification suggestions."
            href="/docs/features/test-gaps"
            icon={AlertTriangle}
          />
          <DocsCard
            title="Breaking Changes"
            description="Detects altered API contracts, deleted database columns, and shifted interfaces."
            href="/docs/features/breaking-changes"
            icon={AlertTriangle}
          />
          <DocsCard
            title="Release Notes"
            description="Generates polished, categorized markdown changelog drafts directly from PR diffs."
            href="/docs/features/release-notes"
            icon={FileText}
          />
        </div>
      </section>

      {/* Architecture & Setup */}
      <section className="space-y-4">
        <div>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Architecture & Setup
          </h2>
          <p className="text-xs text-muted-foreground">
            Infrastructure, environment variables, and system design specifications.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocsCard
            title="Architecture"
            description="Explore the Next.js App Router, Auth.js, Drizzle ORM, and Gemini 2.5 Flash pipeline."
            href="/docs/architecture"
            icon={Cpu}
          />
          <DocsCard
            title="Configuration"
            description="Configure MergePilot for local development and production deployments."
            href="/docs/configuration"
            icon={Settings}
          />
        </div>
      </section>

      {/* Reference */}
      <section className="space-y-4">
        <div>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reference
          </h2>
          <p className="text-xs text-muted-foreground">
            Endpoints, platform updates, and upcoming capabilities.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocsCard
            title="API Reference"
            description="Inspect all implemented REST endpoints, parameters, authentication, and responses."
            href="/docs/api"
            icon={Terminal}
          />
          <DocsCard
            title="Changelog"
            description="Platform release history and engineering milestones."
            href="/docs/changelog"
            icon={History}
          />
          <DocsCard
            title="Roadmap"
            description="Overview of current production capabilities versus planned platform features."
            href="/docs/roadmap"
            icon={Map}
          />
        </div>
      </section>
    </div>
  );
}
