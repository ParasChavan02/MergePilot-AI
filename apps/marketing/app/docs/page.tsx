"use client";

import { useEffect } from "react";

import { getAppUrl } from "@/config/site";

export default function MarketingDocsRedirectPage() {
  const docsUrl = getAppUrl("/docs");

  useEffect(() => {
    window.location.replace(docsUrl);
  }, [docsUrl]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="shadow-xs max-w-md space-y-3 rounded-2xl border border-border bg-card p-8">
        <h1 className="text-base font-semibold text-foreground">Redirecting to Documentation...</h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          You are being redirected to the MergePilot AI documentation. If your browser does not
          redirect you automatically:
        </p>
        <div className="pt-2">
          <a
            href={docsUrl}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90"
          >
            Open Documentation &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
