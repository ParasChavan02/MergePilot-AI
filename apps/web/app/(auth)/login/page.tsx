import Link from "next/link";

import { GitHubLoginButton } from "@/components/auth/github-login-button";
import { MergePilotSymbol } from "@/components/ui/mergepilot-logo";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Readonly<LoginPageProps>) {
  const { callbackUrl } = await searchParams;
  const redirectUrl = callbackUrl ?? "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Icon Header */}
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-transform hover:scale-105 dark:border-[#262626] dark:bg-[#0A0A0A]"
          >
            <MergePilotSymbol className="h-5 w-5" />
          </Link>
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Authentication
            </p>
            <h1 className="text-xl font-bold tracking-tight text-foreground">MergePilot AI</h1>
          </div>
          <p className="mx-auto max-w-xs text-xs text-muted-foreground">
            Understand Pull Requests before you merge them.
          </p>
        </div>

        {/* Centered Auth Card */}
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-xl dark:border-[#262626] dark:bg-[#0A0A0A] sm:p-7">
          <div className="space-y-1 text-center">
            <p className="text-sm font-semibold text-foreground">Sign in to your account</p>
            <p className="text-xs text-muted-foreground">
              Connect via GitHub to access repositories and PR intelligence.
            </p>
          </div>

          <div className="pt-1">
            <GitHubLoginButton callbackUrl={redirectUrl} />
          </div>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground/80">
            By continuing, you agree to our future terms and privacy policy.
          </p>
        </div>

        {/* Return to home link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Return to home
          </Link>
        </div>
      </div>
    </main>
  );
}
