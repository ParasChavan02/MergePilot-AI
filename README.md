# MergePilot AI

MergePilot AI is an AI-powered GitHub Pull Request Intelligence Platform.

It helps developers understand pull requests faster by generating summaries, risk analysis,
breaking change detection, test suggestions, and release notes.

This repository currently contains the Day 1 production foundation only.

## Project Overview

- Modern SaaS landing page with a dark, minimal aesthetic
- GitHub OAuth authentication via Auth.js
- Protected dashboard shell
- Drizzle schema for core entities
- Strict TypeScript and linting configuration
- Theme persistence with dark mode by default

## Architecture

The codebase is organized as a feature-first monorepo-style workspace so product areas can scale
without turning into a flat utility dump.

Core boundaries:

- `apps/` for runnable applications
- `components/` for shared UI primitives and cross-cutting providers
- `features/` for product surfaces like marketing and dashboard
- `server/` for backend-only infrastructure
- `db/` for schema and data access foundations
- `config/` for environment and app configuration
- `actions/` for server actions
- `hooks/` for reusable client hooks
- `types/` for shared TypeScript types

## Folder Structure

```txt
apps/
  web/
    app/
components/
actions/
config/
db/
features/
hooks/
lib/
server/
types/
public/
```

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style component primitives
- Auth.js with GitHub OAuth
- PostgreSQL on Supabase
- Drizzle ORM
- Zod
- Vercel
- pnpm

## Getting Started

- Copy `.env.example` to `.env`.
- Fill in the environment variables.
- Install dependencies with `pnpm install`.
- Run `pnpm dev`.

## Roadmap

- Repository sync
- Pull request ingestion
- AI summary generation
- Risk scoring
- Breaking change detection
- Test suggestions
- Release note drafts
- Activity and usage dashboards
