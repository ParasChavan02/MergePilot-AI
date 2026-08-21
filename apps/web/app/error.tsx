"use client";

export default function Error({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold">We hit an unexpected application error.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The UI is keeping the failure isolated so the rest of the app can remain stable.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-muted p-3 text-left text-xs text-muted-foreground">
          {error.message}
        </pre>
      </div>
    </main>
  );
}
