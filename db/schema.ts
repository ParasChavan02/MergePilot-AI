import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "member"]);
export const pullRequestStateEnum = pgEnum("pull_request_state", [
  "open",
  "closed",
  "merged",
  "draft"
]);
export const analysisStatusEnum = pgEnum("analysis_status", [
  "pending",
  "processing",
  "complete",
  "failed"
]);
export const releaseNoteTypeEnum = pgEnum("release_note_type", [
  "bugfix",
  "feature",
  "breaking",
  "misc"
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow()
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state")
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] })
  })
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (table) => ({
    userIdx: index("sessions_user_id_idx").on(table.userId)
  })
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.identifier, table.token] })
  })
);

export const repositories = pgTable(
  "repositories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    githubId: bigint("github_id", { mode: "number" }).notNull().unique(),
    name: text("name").notNull(),
    fullName: text("full_name").notNull(),
    defaultBranch: text("default_branch").notNull().default("main"),
    private: boolean("private").notNull().default(false),
    description: text("description"),
    htmlUrl: text("html_url").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow()
  },
  (table) => ({
    ownerIdx: index("repositories_owner_id_idx").on(table.ownerId),
    githubIdx: index("repositories_github_id_idx").on(table.githubId)
  })
);

export const pullRequests = pgTable(
  "pull_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    repositoryId: uuid("repository_id")
      .notNull()
      .references(() => repositories.id, { onDelete: "cascade" }),
    githubId: bigint("github_id", { mode: "number" }).notNull().unique(),
    number: integer("number").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    authorLogin: text("author_login").notNull(),
    state: pullRequestStateEnum("state").notNull().default("open"),
    isDraft: boolean("is_draft").notNull().default(false),
    headSha: text("head_sha").notNull(),
    baseSha: text("base_sha").notNull(),
    headRef: text("head_ref").notNull(),
    baseRef: text("base_ref").notNull(),
    mergeable: boolean("mergeable"),
    mergedAt: timestamp("merged_at", { mode: "date" }),
    closedAt: timestamp("closed_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow()
  },
  (table) => ({
    repoIdx: index("pull_requests_repository_id_idx").on(table.repositoryId),
    githubIdx: index("pull_requests_github_id_idx").on(table.githubId),
    numberIdx: index("pull_requests_number_idx").on(table.number)
  })
);

export const analyses = pgTable(
  "analyses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pullRequestId: uuid("pull_request_id")
      .notNull()
      .references(() => pullRequests.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    repositoryId: uuid("repository_id").references(() => repositories.id, { onDelete: "cascade" }),
    status: analysisStatusEnum("status").notNull().default("pending"),
    summary: text("summary"),
    riskLevel: text("risk_level").notNull().default("low"),
    riskScore: integer("risk_score").notNull().default(0),
    breakingChangeDetected: boolean("breaking_change_detected").notNull().default(false),
    keyChanges: jsonb("key_changes").$type<string[]>().notNull().default([]),
    breakingChanges: jsonb("breaking_changes")
      .$type<{
        detected: boolean;
        severity?: string;
        items: Array<{ area: string; reason: string; potentialImpact: string }>;
      }>()
      .notNull()
      .default({ detected: false, items: [] }),
    testGaps: jsonb("test_gaps")
      .$type<
        Array<{
          test: string;
          reason: string;
          suggestedVerification?: string;
        }>
      >()
      .notNull()
      .default([]),
    recommendations: jsonb("recommendations").$type<string[]>().notNull().default([]),
    releaseNotes: text("release_notes"),
    testSuggestions: jsonb("test_suggestions").$type<string[]>().notNull().default([]),
    releaseNotesDraft: text("release_notes_draft"),
    modelVersion: text("model_version"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow()
  },
  (table) => ({
    prIdx: index("analyses_pull_request_id_idx").on(table.pullRequestId),
    userIdx: index("analyses_user_id_idx").on(table.userId),
    repoIdx: index("analyses_repository_id_idx").on(table.repositoryId),
    statusIdx: index("analyses_status_idx").on(table.status)
  })
);

export const releaseNotes = pgTable(
  "release_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    analysisId: uuid("analysis_id")
      .notNull()
      .references(() => analyses.id, { onDelete: "cascade" }),
    repositoryId: uuid("repository_id")
      .notNull()
      .references(() => repositories.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    type: releaseNoteTypeEnum("type").notNull().default("misc"),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow()
  },
  (table) => ({
    analysisIdx: index("release_notes_analysis_id_idx").on(table.analysisId),
    repoIdx: index("release_notes_repository_id_idx").on(table.repositoryId)
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  repositories: many(repositories),
  analyses: many(analyses)
}));

export const repositoriesRelations = relations(repositories, ({ one, many }) => ({
  owner: one(users, {
    fields: [repositories.ownerId],
    references: [users.id]
  }),
  pullRequests: many(pullRequests),
  releaseNotes: many(releaseNotes),
  analyses: many(analyses)
}));

export const pullRequestsRelations = relations(pullRequests, ({ one, many }) => ({
  repository: one(repositories, {
    fields: [pullRequests.repositoryId],
    references: [repositories.id]
  }),
  analyses: many(analyses)
}));

export const analysesRelations = relations(analyses, ({ one, many }) => ({
  pullRequest: one(pullRequests, {
    fields: [analyses.pullRequestId],
    references: [pullRequests.id]
  }),
  repository: one(repositories, {
    fields: [analyses.repositoryId],
    references: [repositories.id]
  }),
  user: one(users, {
    fields: [analyses.userId],
    references: [users.id]
  }),
  releaseNotes: many(releaseNotes)
}));

export const releaseNotesRelations = relations(releaseNotes, ({ one }) => ({
  analysis: one(analyses, {
    fields: [releaseNotes.analysisId],
    references: [analyses.id]
  }),
  repository: one(repositories, {
    fields: [releaseNotes.repositoryId],
    references: [repositories.id]
  })
}));
