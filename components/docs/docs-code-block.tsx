"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface DocsCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function DocsCodeBlock({
  code,
  language = "bash",
  filename,
  className
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div
      className={cn(
        "group relative my-5 overflow-hidden rounded-xl border border-border bg-[#F5F5F5] dark:bg-[#111111]",
        className
      )}
    >
      <div className="flex h-9 items-center justify-between border-b border-border/80 bg-muted/40 px-3.5">
        <span className="font-mono text-[11px] font-medium text-muted-foreground">
          {filename || language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex h-6 items-center gap-1.5 rounded-md border border-transparent px-2 font-mono text-[10px] text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-foreground" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="scrollbar-thin max-w-full overflow-x-auto p-3.5 font-mono text-[11px] leading-relaxed text-foreground sm:p-4 sm:text-xs">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
