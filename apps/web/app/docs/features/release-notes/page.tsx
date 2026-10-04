import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Release Notes",
  description:
    "Learn how MergePilot automatically drafts categorized, publication-ready markdown release notes from pull request diffs."
};

const tocItems: TocItem[] = [
  { title: "Overview", id: "overview" },
  { title: "Generation Pipeline", id: "pipeline" },
  { title: "Classification & Storage", id: "storage" },
  { title: "Representative Markdown Example", id: "example" },
  { title: "Dashboard & Export", id: "dashboard-export" }
];

export default function ReleaseNotesPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Core Features
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Release Notes
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            MergePilot synthesizes technical pull request diffs into clean, categorized markdown
            changelog drafts suitable for engineering changelogs and customer release
            communications.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Writing changelogs manually is tedious and often results in vague release notes like
            &ldquo;fixes and improvements&rdquo;. MergePilot automatically distills the functional
            impact of every pull request into human-readable bullet points grouped by release
            category.
          </p>
        </section>

        {/* Generation Pipeline */}
        <section id="pipeline" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Generation Pipeline
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            The release note generation process follows an automated 5-step sequence:
          </p>

          <div className="rounded-xl border border-border bg-[#F5F5F5] p-4 font-mono text-xs text-foreground dark:bg-[#111111]">
            Pull Request Context → Change Analysis → Change Classification → Release Note Drafting →
            Relational Storage
          </div>

          <ol className="list-decimal space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong className="text-foreground">Diff Extraction:</strong> The system collects file
              patches and commit messages to identify user-facing vs internal modifications.
            </li>
            <li>
              <strong className="text-foreground">Classification:</strong> Changes are categorized
              into standard release sections: Features, Improvements, Bug Fixes, or Breaking
              Changes.
            </li>
            <li>
              <strong className="text-foreground">Tone Formatting:</strong> The model formats the
              draft in clean GitHub-flavored markdown without unnecessary filler words.
            </li>
          </ol>
        </section>

        {/* Classification & Storage */}
        <section id="storage" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Classification & Storage
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            When an analysis completes, MergePilot persists the release note draft directly in the{" "}
            <code>release_notes</code> PostgreSQL table (<code>db/schema.ts</code>):
          </p>

          <DocsCodeBlock
            language="typescript"
            filename="db/schema.ts"
            code={`export const releaseNoteTypeEnum = pgEnum("release_note_type", [
  "bugfix",
  "feature",
  "breaking",
  "misc"
]);

export const releaseNotes = pgTable("release_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  analysisId: uuid("analysis_id").notNull().references(() => analyses.id, { onDelete: "cascade" }),
  repositoryId: uuid("repository_id").notNull().references(() => repositories.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: releaseNoteTypeEnum("type").notNull().default("misc"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow()
});`}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            If a breaking change was identified, the record type is automatically flagged as{" "}
            <code>breaking</code>; otherwise, it defaults to <code>feature</code> or{" "}
            <code>bugfix</code>.
          </p>
        </section>

        {/* Representative Markdown Example */}
        <section id="example" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Representative Markdown Example
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Below is a representative markdown draft generated for an authentication pull request:
          </p>

          <DocsCodeBlock
            language="markdown"
            filename="CHANGELOG.md (Example Draft)"
            code={`### Features
- Migrated session token verification to signed JWT strategy for stateless API scalability.
- Added session expiration redirect handling to authentication middleware.

### Improvements
- Added composite database index on \`sessions(user_id, expires)\` to accelerate active session lookups.
- Standardized OAuth error callback messages with typed error codes.

### Breaking Changes
- Session cookies now use the \`__Secure-authjs.session-token\` prefix in production environments.`}
          />

          <DocsCallout type="tip" title="Representative Format">
            The above snippet is a representative example illustrating markdown structure. The
            actual release notes reflect your pull request commits and modifications.
          </DocsCallout>
        </section>

        {/* Dashboard & Export */}
        <section id="dashboard-export" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Dashboard & Export
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Generated release notes can be accessed in two ways:
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              <strong>Directly on the PR:</strong> In the pull request detail view (
              <code>/dashboard/repositories/[owner]/[repo]/pulls/[number]</code>) under the{" "}
              <em>Release Notes</em> tab, with a 1-click &ldquo;Copy Markdown&rdquo; button.
            </li>
            <li>
              <strong>Workspace Feed:</strong> Across all analyzed pull requests in the{" "}
              <strong>Release Notes</strong> view (<code>/dashboard/release-notes</code>), providing
              a unified timeline of recent engineering changes.
            </li>
          </ul>
        </section>

        <DocsPager currentPath="/docs/features/release-notes" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
