# Contributing to MergePilot AI

Thank you for your interest in contributing to MergePilot AI!

MergePilot AI is an open-source, AI-powered GitHub Pull Request Intelligence platform designed to help engineering teams understand pull requests before merging them. It combines deterministic static code analysis with Google Gemini reasoning to evaluate deployment risk, detect breaking changes, uncover test omissions, and draft release notes.

We welcome contributions from developers of all skill levels. Whether you are fixing a bug, adding new risk engine patterns, improving documentation, or writing tests, your help is appreciated.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What You Can Contribute](#what-you-can-contribute)
- [Before You Start](#before-you-start)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Branch Naming](#branch-naming)
- [Commit Guidelines](#commit-guidelines)
- [Code Quality & Standards](#code-quality--standards)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)
- [Security](#security)
- [Questions](#questions)

---

## Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating in project discussions, opening issues, or submitting pull requests.

---

## What You Can Contribute

We welcome contributions across several areas of the platform:

- **Risk Engine Rules**: Adding new deterministic regex patterns or heuristics in `server/risk/engine.ts` (e.g., framework-specific configuration changes, security boundaries, or migration indicators).
- **Bug Fixes**: Resolving issues with GitHub API normalization, error handling, session edge cases, or UI state management.
- **UI & UX Refinement**: Enhancing dashboard responsiveness, accessibility (a11y), keyboard navigation, and theme consistency within our monochrome design system.
- **Documentation**: Improving explanations, guides, or API references under `/docs` and in project documentation.
- **Automated Tests**: Expanding unit and integration tests under `tests/` using Vitest to ensure regression prevention.
- **Performance & Efficiency**: Optimizing bundle size, caching strategies, database queries, and context budgeting.

---

## Before You Start

1. **Check Existing Issues**: Before starting work on a new feature or substantial bug fix, search the [GitHub Issues](https://github.com/ParasChavan02/MergePilot-AI/issues) to ensure someone else is not already working on it.
2. **Open an Issue for Large Changes**: If you plan to make large architectural changes, introduce new dependencies, or alter database schemas, open an issue first to discuss your proposal with the maintainers.
3. **Keep Scope Focused**: Avoid bundling unrelated refactors, cosmetic reformatting, or multiple distinct features into a single pull request.

---

## Development Setup

MergePilot AI is configured as a pnpm monorepo. Follow these steps to set up your local development environment.

### Prerequisites

- **Node.js**: v18.18.0 or later (Node.js 20+ recommended)
- **pnpm**: v9.15.0 or later (`npm install -g pnpm`)
- **PostgreSQL**: A running PostgreSQL database instance (local PostgreSQL, Neon, Supabase, or Render PostgreSQL)
- **GitHub Account**: Required to configure a GitHub OAuth application for local testing
- **Google Gemini API Key**: Required for AI PR intelligence features (obtainable from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/ParasChavan02/MergePilot-AI.git
cd mergepilot-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the provided `.env.example` file to `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Fill in the required values:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/mergepilot"

# 32-character secret for signing JWT session tokens (generate with: openssl rand -hex 32)
AUTH_SECRET="your_32_character_hex_secret_here"

# GitHub OAuth Application credentials
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"

# Google Gemini API key
GEMINI_API_KEY="your_google_gemini_api_key"
```

> [!WARNING]
> **Never commit real credentials or secret keys.** Keep `.env`, `.env.local`, and any deployment credentials strictly in your private local environment. See [SECURITY.md](SECURITY.md) for details.

### 4. Configure GitHub OAuth Application

1. Go to **GitHub Settings → Developer Settings → OAuth Apps → New OAuth App**.
2. Set **Application Name**: `MergePilot AI (Dev)`.
3. Set **Homepage URL**: `http://localhost:3000`.
4. Set **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`.
5. Copy the generated **Client ID** and create a **Client Secret** to add to your `.env.local`.

### 5. Apply Database Schema

Push the Drizzle ORM schema to your PostgreSQL database:

```bash
# Push schema directly to database
pnpm db:push

# (Optional) Launch visual Drizzle Studio to inspect database tables
pnpm db:studio
```

### 6. Start the Development Server

```bash
pnpm dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

To run the static marketing landing page locally:

```bash
pnpm dev:marketing
```

---

## Project Structure

```
mergepilot-ai/
├── actions/                  # Next.js Server Actions (auth, mutations)
├── apps/
│   ├── web/                  # Primary Next.js 15 dynamic web application
│   │   ├── app/
│   │   │   ├── (auth)/       # Authentication routes (/login)
│   │   │   ├── (dashboard)/  # Authenticated dashboard views
│   │   │   ├── (marketing)/  # Landing page
│   │   │   ├── api/          # Backend REST API routes
│   │   │   ├── docs/         # Documentation portal routes
│   │   │   └── globals.css   # Monochrome design tokens & CSS variables
│   │   └── middleware.ts     # Route protection middleware
│   └── marketing/            # Standalone static marketing site export
├── components/
│   ├── auth/                 # Authentication UI components
│   ├── docs/                 # Documentation header, sidebar, TOC, and search
│   ├── providers/            # Theme, session, and application providers
│   └── ui/                   # Reusable UI primitives (buttons, cards, badges)
├── config/                   # Navigation, environment, and site configuration
├── db/
│   └── schema.ts             # Drizzle ORM PostgreSQL schema definitions
├── features/                 # Domain feature modules (dashboard, repositories, pulls)
├── lib/                      # Shared utility functions and formatting helpers
├── server/
│   ├── ai/                   # Gemini client, prompt templates, and Zod schemas
│   ├── auth.ts               # Auth.js (NextAuth) configuration & Drizzle adapter
│   ├── db.ts                 # PostgreSQL database connection pool
│   ├── github/               # Octokit client, PR context retrieval, budgeting
│   ├── risk/                 # Deterministic risk engine and scoring synthesis
│   └── services/             # Database persistence and caching services
├── tests/                    # Vitest unit and integration test suites
├── vitest.config.ts          # Vitest test runner configuration
└── drizzle.config.ts         # Drizzle Kit configuration
```

---

## Making Changes

1. **Create a Topic Branch**: Always create a dedicated branch from `main` before starting work.
2. **Adhere to the Monochrome Design System**: MergePilot uses a strict black, white, and grayscale palette. Do not introduce colored buttons, colorful status pills, or rainbow gradients.
3. **Preserve Existing Architecture**: Do not rewrite working core services or modify schema definitions unnecessarily.
4. **Maintain Type Safety**: Avoid using `any`. Ensure all new data structures are typed and validated with Zod where external inputs are received.

---

## Branch Naming

Use descriptive branch names with clear prefixes:

- `feat/add-webhook-event-handler`
- `fix/github-rate-limit-retry`
- `docs/update-quick-start-guide`
- `refactor/pr-context-normalization`
- `perf/optimize-analysis-storage-queries`
- `test/add-risk-engine-edge-cases`
- `chore/update-pnpm-dependencies`
- `security/sanitize-pr-patch-diffs`

---

## Commit Guidelines

Write clear, concise commit messages in the imperative mood. We recommend following simple conventional commit style:

- `feat: add test gap verification suggestions`
- `fix: handle missing author avatar in PR normalization`
- `docs: update environment variable configuration guide`
- `refactor: extract deterministic risk signal constants`
- `test: add unit tests for destructive SQL regex patterns`
- `chore: update drizzle-orm to latest version`

---

## Code Quality & Standards

Before opening a pull request, verify that your changes adhere to project standards:

```bash
# 1. Type check
pnpm --dir apps/web exec tsc --noEmit

# 2. Run linter
pnpm lint

# 3. Fix auto-fixable lint issues
pnpm --dir apps/web lint --fix

# 4. Format code
pnpm format
```

Key guidelines:

- **TypeScript**: Keep TypeScript strict. Respect `exactOptionalPropertyTypes`.
- **Imports**: Group imports logically (external libraries first, internal alias `@/...` second, relative imports third).
- **Error Handling**: Throw typed errors or return appropriate HTTP status codes; avoid unhandled promise rejections.
- **Defensive Input Handling**: Always validate query parameters, URL path arguments, and request bodies.

---

## Testing

MergePilot uses **Vitest** for unit and integration testing. Run tests locally:

```bash
# Run all tests once
pnpm test

# Run tests in watch mode during development
pnpm vitest
```

When modifying risk rules, GitHub context normalization, or AI schemas, add or update corresponding test cases in `tests/`:

- `tests/risk-engine.test.ts`: Deterministic signal scoring and synthesis rules
- `tests/github-normalization.test.ts`: GitHub API response sanitization and budgeting
- `tests/ai-schema.test.ts`: Zod schema validation for AI intelligence payloads
- `tests/database-queries.test.ts`: Database query mapping and persistence logic
- `tests/relative-time.test.ts`: Date and time formatting helpers

Ensure all tests pass with exit code 0 before submitting your changes.

---

## Submitting a Pull Request

When your changes are ready, push your branch to GitHub and open a Pull Request against the `main` branch:

1. **Title**: Provide a clear, descriptive title summarizing the change.
2. **Description**:
   - **What changed**: A bulleted summary of specific code modifications.
   - **Why it changed**: Context or problem statement explaining the motivation.
   - **How it was tested**: Steps taken to verify functionality (e.g., `pnpm test`, manual testing on local instance).
   - **Screenshots / Recordings**: Required for UI changes (include light and dark mode screenshots).
3. **Review CI / Checks**: Ensure linting, type-checking, and test suites pass.
4. **Respond to Feedback**: Reviewers may ask questions or suggest refinements. Keep discussions professional and collaborative.

---

## Reporting Issues

If you find a bug or have a feature request:

1. Search existing [Issues](https://github.com/ParasChavan02/MergePilot-AI/issues) to avoid duplicates.
2. If opening a bug report, include:
   - Clear, descriptive title
   - Step-by-step reproduction instructions
   - Expected behavior vs. actual behavior
   - Relevant error messages or browser console logs
   - Node.js, OS, and browser versions (if applicable)

> [!CAUTION]
> **Do not report security vulnerabilities via public GitHub Issues.** See the section below.

---

## Security

Security is critical to MergePilot AI. If you discover a security vulnerability or potential credential leak:

- **Do NOT** open a public issue.
- **Do NOT** discuss the vulnerability publicly.
- Follow the disclosure procedure documented in our [Security Policy](SECURITY.md).

---

## Questions

If you have questions about contributing or need guidance on implementation details:

- Open a discussion or question in [GitHub Issues](https://github.com/ParasChavan02/MergePilot-AI/issues).
- Reach out to the maintainer via the contact email listed in the repository: `chavanparas0201@gmail.com`.
