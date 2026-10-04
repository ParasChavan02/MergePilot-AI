ALTER TABLE "analyses" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "repository_id" uuid;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "risk_level" text DEFAULT 'low' NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "key_changes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "breaking_changes" jsonb DEFAULT '{"detected":false,"items":[]}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "test_gaps" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "recommendations" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "release_notes" text;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analyses_user_id_idx" ON "analyses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "analyses_repository_id_idx" ON "analyses" USING btree ("repository_id");