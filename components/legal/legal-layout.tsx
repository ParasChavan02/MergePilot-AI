import { ArrowLeft, ArrowUpRight, Calendar, FileText, Mail, Shield } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { LegalToc, type LegalTocItem } from "./legal-toc";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LegalLayoutProps {
  title: string;
  tagline: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  relatedDocument: {
    label: string;
    href: string;
    description: string;
  };
  tocItems: LegalTocItem[];
  children: ReactNode;
}

export function LegalLayout({
  title,
  tagline,
  effectiveDate,
  lastUpdated,
  version,
  relatedDocument,
  tocItems,
  children
}: LegalLayoutProps) {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:px-8">
      {/* Breadcrumb & Home Link */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 font-mono text-xs text-muted-foreground"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span className="text-border">/</span>
        <span>Legal</span>
        <span className="text-border">/</span>
        <span className="font-semibold text-foreground">{title}</span>
      </nav>

      {/* Header Banner */}
      <header className="mb-10 space-y-4 border-b border-border/60 pb-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 font-mono text-[11px]">
            <Shield className="h-3 w-3 text-muted-foreground" />
            Legal Disclosure
          </Badge>
          <span className="font-mono text-[11px] text-muted-foreground">•</span>
          <span className="font-mono text-xs text-muted-foreground">Version {version}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>

        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {tagline}
        </p>

        {/* Metadata info cards bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Effective Date:</span>
            <span className="font-medium text-foreground">{effectiveDate}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last Updated:</span>
            <span className="font-medium text-foreground">{lastUpdated}</span>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg text-xs font-medium"
          >
            <Link href={relatedDocument.href as any}>
              <FileText className="h-3.5 w-3.5" />
              <span>{relatedDocument.label}</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Two-Column Body: Content + Sticky TOC */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        {/* Main Document Content */}
        <main className="min-w-0 flex-1 space-y-12">
          {children}

          {/* Bottom Companion Document Card */}
          <section className="shadow-xs rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Companion Agreement
                </p>
                <h3 className="text-base font-semibold text-foreground">{relatedDocument.label}</h3>
                <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
                  {relatedDocument.description}
                </p>
              </div>
              <Button asChild size="sm" className="shrink-0 gap-1.5">
                <Link href={relatedDocument.href as any}>
                  <span>Read {relatedDocument.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Contact & Support Section */}
          <section className="rounded-2xl border border-border/80 bg-muted/30 p-6 text-xs text-muted-foreground sm:p-8">
            <h3 className="text-sm font-semibold text-foreground">Questions or Data Requests?</h3>
            <p className="mt-1 leading-relaxed">
              If you have questions regarding these terms, your privacy rights, or wish to request
              manual deletion of your stored repository analyses, please reach out to the project
              maintainer:
            </p>
            <div className="mt-4 flex flex-wrap gap-4 font-mono text-[11px]">
              <a
                href="mailto:chavanparas0201@gmail.com"
                className="inline-flex items-center gap-1.5 text-foreground hover:underline"
              >
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>chavanparas0201@gmail.com</span>
              </a>
              <a
                href="https://github.com/ParasChavan02/MergePilot-AI/issues"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground hover:underline"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span>GitHub Issues</span>
              </a>
            </div>
          </section>
        </main>

        {/* Sticky Table of Contents on Desktop */}
        <LegalToc items={tocItems} />
      </div>
    </div>
  );
}
