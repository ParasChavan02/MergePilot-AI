"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Copy,
  FileCode,
  GitBranch,
  Minus,
  Plus,
  ShieldAlert,
  Zap
} from "lucide-react";

import { BorderBeam } from "@/components/magicui/border-beam";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ProductPreview() {
  return (
    <div className="relative mx-auto max-w-5xl text-left">
      {/* Outer Window Container with subtle premium shadow */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-border/50 dark:border-[#262626] dark:bg-[#0A0A0A]">
        <BorderBeam size={280} duration={16} colorFrom="#ffffff" colorTo="#3f3f46" />

        {/* Console / Window Title Bar */}
        <div className="flex h-10 items-center justify-between border-b border-border bg-muted/40 px-4 dark:border-[#1A1A1A] dark:bg-[#050505]">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-border dark:bg-[#262626]" />
            <div className="h-2.5 w-2.5 rounded-full bg-border dark:bg-[#262626]" />
            <div className="h-2.5 w-2.5 rounded-full bg-border dark:bg-[#262626]" />
            <span className="ml-2 max-w-[200px] truncate font-mono text-[11px] text-muted-foreground sm:max-w-none">
              mergepilot.ai / ParasChavan02 / MergePilot-AI / pulls / 124
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-foreground dark:border-[#262626] dark:bg-[#111111]">
              <Zap className="h-2.5 w-2.5 text-muted-foreground" />
              Intelligence Active
            </span>
          </div>
        </div>

        {/* Product Interface Body */}
        <div className="space-y-6 p-5 sm:p-6 md:p-8">
          {/* PR Header Row */}
          <div className="flex flex-col gap-3 border-b border-border pb-5 dark:border-[#1A1A1A] md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-muted-foreground">#124</span>
                <Badge variant="open">Open</Badge>
                <Badge variant="medium" className="font-mono text-[10px]">
                  RISK: MEDIUM (58/100)
                </Badge>
                <span className="text-xs text-muted-foreground">
                  • opened by <strong className="font-semibold text-foreground">Paras</strong>
                </span>
              </div>

              <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
                Refactor authentication middleware and session handling
              </h3>

              <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-muted-foreground sm:gap-3">
                <span className="inline-flex items-center gap-1 text-foreground">
                  <GitBranch className="h-3 w-3" />
                  main <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />{" "}
                  fix/auth-middleware
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-0.5 text-foreground">
                  <Plus className="h-3 w-3 text-muted-foreground" /> 486
                </span>
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Minus className="h-3 w-3" /> 173
                </span>
                <span className="text-border">•</span>
                <span>12 files changed</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start font-mono text-xs text-muted-foreground md:self-auto">
              <span>Representative Preview</span>
            </div>
          </div>

          {/* Intelligence Grid */}
          <div className="grid gap-4 text-left md:grid-cols-12">
            {/* Left 7 cols: AI Summary, Breaking Changes & Test Gaps */}
            <div className="space-y-4 md:col-span-7">
              {/* AI Summary */}
              <div className="space-y-2 rounded-lg border border-border bg-background p-4 dark:border-[#262626] dark:bg-[#050505]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-foreground" />
                  AI Summary
                </div>
                <p className="text-xs leading-relaxed text-foreground/90">
                  This pull request refactors authentication middleware and changes session handling
                  across the application. It optimizes route guarding and implements RFC 9207
                  compliant issuer identification.
                </p>
              </div>

              {/* Breaking Changes & Test Gaps Row (Stacked on Mobile, 2 cols on Desktop) */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1 rounded-lg border border-border bg-background p-3.5 dark:border-[#262626] dark:bg-[#050505]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-foreground">
                      <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                      Breaking Changes
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      None
                    </Badge>
                  </div>
                  <p className="text-[11px] leading-normal text-muted-foreground">
                    No breaking API changes detected.
                  </p>
                </div>

                <div className="space-y-1 rounded-lg border border-border bg-background p-3.5 dark:border-[#262626] dark:bg-[#050505]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Test Gaps
                    </span>
                    <Badge variant="medium" className="text-[10px]">
                      2 Gaps
                    </Badge>
                  </div>
                  <p className="text-[11px] leading-normal text-muted-foreground">
                    2 changed code paths may require additional validation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Risk Signals & Release Notes */}
            <div className="flex flex-col justify-between space-y-3 rounded-lg border border-border bg-background p-4 dark:border-[#262626] dark:bg-[#050505] md:col-span-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ShieldAlert className="h-3.5 w-3.5 text-foreground" />
                    Risk Analysis
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground">58 / 100</span>
                </div>

                <div className="mt-2.5">
                  <Progress
                    value={58}
                    indicatorClassName="bg-foreground"
                    className="h-1.5 bg-muted"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Risk Signals (3):
                  </p>
                  <ul className="space-y-1.5 text-xs text-foreground/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                      <span>Authentication middleware modified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                      <span>Session behavior changed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                      <span>Session refresh test assertions omitted</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Release Notes Draft footer snippet */}
              <div className="border-t border-border pt-3 dark:border-[#1A1A1A]">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5 text-muted-foreground" />
                    Release Notes Draft
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-foreground">
                    <Copy className="h-3 w-3" />
                    Compiled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
