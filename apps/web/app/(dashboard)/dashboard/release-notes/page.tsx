import { ReleaseNotesFeed } from "@/features/release-notes/release-notes-feed";

export default function ReleaseNotesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Changelog Intelligence
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Release Notes
        </h1>
        <p className="max-w-2xl text-xs text-muted-foreground md:text-sm">
          Automatically compiled markdown release notes ready to publish for staging and production
          deployments.
        </p>
      </header>

      <ReleaseNotesFeed />
    </div>
  );
}
