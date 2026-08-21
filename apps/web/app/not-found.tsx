import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold">This page does not exist.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The route may have moved, or you may have followed an outdated link.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
