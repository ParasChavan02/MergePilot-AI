# MergePilot AI

> AI-Powered GitHub Pull Request Intelligence Platform. Understand what changed, what could break, and what to verify before merging.

---

## 1. What is MergePilot AI?

**MergePilot AI** is an engineering intelligence layer built on top of GitHub Pull Requests.

While GitHub natively presents diffs, line comments, and checks, it leaves the most critical engineering question unanswered:

> **"What does this pull request actually mean for my system?"**

MergePilot analyzes code diffs, security boundaries, database migrations, and API contracts to translate raw change into actionable engineering foresight:

```
CHANGE  →  ENGINEERING IMPACT  →  RISK SCORE  →  WHAT COULD BREAK  →  WHAT TO TEST  →  SHOULD I MERGE?
```

---

## 2. The Problem

Modern development teams review dozens of pull requests daily. Standard code review suffers from:

- **Reviewer Fatigue**: Large diffs (500+ lines) get rubber-stamped without deep comprehension of transitive dependencies.
- **Hidden Breaking Changes**: Silent payload modifications, removed struct fields, or altered database column types trigger downstream outages.
- **Test Blindspots**: Developers modify mission-critical authentication or billing paths without writing accompanying tests, and reviewers miss the gap.
- **Context Fragmentation**: Authors write brief or empty PR descriptions, forcing reviewers to reverse-engineer intent from raw git patches.

---

## 3. The Solution

MergePilot AI acts as an autonomous staff-level engineer embedded in your review workflow:

1. **Ingests Context Server-Side**: Fetches PR metadata, commit logs, file lists, and diff patches directly via authenticated GitHub APIs.
2. **Deterministic Risk Analysis**: Scans for high-consequence signals including authentication, session handling, cryptography, database migrations, destructive DDL, environment changes, and dependency updates.
3. **Contextual AI Intelligence**: Powered by Google Gemini with strict JSON schema validation to synthesize architectural impact, test gaps, and recommendations without hallucinating non-existent files or APIs.
4. **Automated Changelogs**: Generates clean, production-ready markdown release notes formatted for immediate staging and production publishing.

---

## 4. Key Features

- **GitHub Repository Browser**: Fast, responsive repository catalog with language filtering, search, and instant pull request navigation.
- **Pull Request Inspection**: Detailed PR list with filter tabs (`Open`, `Closed`, `All`), author avatars, additions/deletions diff counts, and previous analysis status.
- **Composite Risk Scoring (0–100)**: Blends deterministic code signals with contextual AI reasoning into an explainable score and level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **Breaking Change Detection**: Identifies removed API fields, altered database schemas, and modified contract signatures with itemized blast-radius analysis.
- **Test Gap Audit**: Detects modified business logic or security paths lacking corresponding automated tests and provides concrete verification steps.
- **Actionable Verification Recommendations**: Clear, prioritized recommendations for staging validation, rollbacks, and edge-case testing.
- **One-Click Release Notes**: Auto-generated markdown changelogs with one-click clipboard copying.
- **Intelligent Analysis Caching**: Analyses are persisted in PostgreSQL; reopening an analyzed PR loads instantly without redundant AI API calls. Explicit re-analysis triggers fresh evaluation on demand.
- **Live Intelligence Dashboard**: Real-time metrics tracking connected repositories, open PRs, total analyses performed, and high-risk flags.

---

## 5. Architecture

```
Browser Client (React 19 / Next.js 15 App Router)
     │
     ├── Cookie Session (JWT / Auth.js)
     ▼
Next.js Server Layer (Node.js Runtime)
     │
     ├── Server Actions & API Route Handlers (/api/github/*, /api/analysis/*)
     │        │
     │        ├── GitHub Service (Octokit authenticated with server-only OAuth token)
     │        │        │
     │        │        ▼
     │        │   GitHub REST API v3
     │        │
     │        ├── Risk Engine (Deterministic Structural Analysis)
     │        │
     │        ├── AI Engine (Google Gemini 2.5 Flash via @google/genai)
     │        │        │
     │        │        ▼
     │        │   Zod Schema Validation & Risk Synthesis
     │        │
     │        └── Database Access Layer (Drizzle ORM)
     │                 │
     │                 ▼
     └─────────► PostgreSQL Database
```

---

## 6. Tech Stack

- **Framework**: Next.js 15 (App Router with Server Components & Server Actions)
- **Language**: TypeScript (Strict mode with `exactOptionalPropertyTypes`)
- **UI & Styling**: Tailwind CSS, shadcn/ui primitives, Magic UI components (`NumberTicker`, `SpotlightCard`, `BorderBeam`, `GridPattern`)
- **Authentication**: Auth.js / NextAuth v5 with GitHub OAuth provider
- **Database & ORM**: PostgreSQL with Drizzle ORM
- **AI Engine**: Google Gemini API (`@google/genai`) with Gemini 2.5 Flash
- **GitHub Integration**: `@octokit/rest` with server-side token retrieval
- **Validation**: Zod schema parsing across all external API and AI boundaries
- **Testing**: Vitest for unit and integration testing
- **Package Manager**: pnpm workspace

---

## 7. Project Structure

```
mergepilot-ai/
├── actions/                         # Server actions (e.g. auth login/logout)
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (auth)/login/        # GitHub sign-in page
│       │   ├── (dashboard)/
│       │   │   └── dashboard/
│       │   │       ├── page.tsx     # Live dashboard overview & stats
│       │   │       ├── analyses/    # Historical analyses list
│       │   │       ├── release-notes/# Generated release notes feed
│       │   │       ├── repositories/# Repository browser & PR details
│       │   │       │   └── [owner]/[repo]/pulls/
│       │   │       │       └── [number]/ # Central PR Intelligence suite
│       │   │       └── settings/    # Settings & roadmap preview
│       │   ├── (marketing)/         # Landing page with realistic preview
│       │   ├── api/
│       │   │   ├── analysis/        # Analyses listing & execution
│       │   │   ├── auth/            # Auth.js route handler
│       │   │   ├── github/          # Secure server-side GitHub routes
│       │   │   └── release-notes/   # Release notes retrieval
│       │   ├── globals.css          # Design system variables & animations
│       │   └── layout.tsx           # Root application shell
│       ├── middleware.ts            # Route protection middleware
│       └── next.config.ts           # Next.js configuration
├── components/
│   ├── auth/                        # Login components
│   ├── magicui/                     # Magic UI animations & effects
│   ├── providers/                   # Session, theme, and context providers
│   └── ui/                          # Badge, button, card, input, progress, tabs
├── config/                          # Environment, navigation, and site metadata
├── db/
│   └── schema.ts                    # Drizzle PostgreSQL schema definitions
├── drizzle/                         # Auto-generated SQL migrations
├── features/                        # Domain UI features (repositories, pulls, etc.)
├── lib/                             # Shared utility functions and prompt builders
├── server/
│   ├── ai/                          # Gemini client, prompts, schemas, orchestrator
│   ├── auth.ts                      # Auth.js configuration & Drizzle adapter
│   ├── db.ts                        # PostgreSQL database client connection
│   ├── github/                      # Modular GitHub client, repos, PRs, error handling
│   ├── risk/                        # Deterministic risk engine & synthesis
│   └── services/                    # Database persistence & caching services
├── tests/                           # Unit tests (Risk engine, Normalization, Schemas)
├── vitest.config.ts                 # Vitest test configuration
└── drizzle.config.ts                # Drizzle kit configuration
```

---

## 8. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgres://username:password@hostname:5432/database_name?sslmode=require"

# NextAuth / Auth.js
AUTH_SECRET="your-32-character-secret-generated-via-openssl-rand-hex-32"
# In production, set AUTH_URL to your deployment domain:
# AUTH_URL="https://your-service.onrender.com"

# GitHub OAuth App
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"

# Google Gemini API
GEMINI_API_KEY="your_google_gemini_api_key"
```

---

## 9. GitHub OAuth Setup

1. Open [GitHub Developer Settings](https://github.com/settings/developers) and select **New OAuth App**.
2. Set **Application Name**: `MergePilot AI`.
3. Set **Homepage URL**:
   - Local: `http://localhost:3000`
   - Production: `https://<your-render-subdomain>.onrender.com`
4. Set **Authorization callback URL**:
   - Local: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://<your-render-subdomain>.onrender.com/api/auth/callback/github`
5. Copy the generated **Client ID** and generate a new **Client Secret**.
6. Place them in your `.env` file as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

---

## 10. PostgreSQL & Drizzle Setup

MergePilot AI uses PostgreSQL (compatible with Neon, Supabase, Render PostgreSQL, AWS RDS) paired with Drizzle ORM.

### Generate & Apply Migrations

```bash
# Generate SQL migration files from schema
pnpm db:generate

# Push schema directly to database
pnpm db:push

# Or execute migrations
pnpm db:migrate

# Open visual Drizzle Studio database viewer
pnpm db:studio
```

---

## 11. Google Gemini AI Setup

1. Obtain an API key from Google AI Studio: [https://aistudio.google.com/](https://aistudio.google.com/).
2. Add the key to your `.env` as `GEMINI_API_KEY`.
3. MergePilot uses the high-performance `gemini-2.5-flash` model with JSON schema enforcement for sub-second, highly structured analysis.

---

## 12. Local Development

```bash
# 1. Clone repository
git clone https://github.com/ParasChavan02/MergePilot-AI.git
cd mergepilot-ai

# 2. Install workspace dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Generate and push database schema
pnpm db:generate
pnpm db:push

# 5. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 13. Testing

The test suite validates data normalization, error mapping, risk evaluation, and schema validation:

```bash
# Run test suite
pnpm test

# Run tests in watch mode
pnpm vitest
```

---

## 14. Production Build

To verify type safety, linting, and build optimization:

```bash
# Run type checking
pnpm --dir apps/web exec tsc --noEmit

# Run ESLint
pnpm lint

# Build production bundle for Web Service
pnpm build

# Build static marketing export for Static Site
pnpm build:marketing

# Start production server
pnpm start
```

---

## 15. Render Deployment (Blueprint with Dual-Hosting)

MergePilot AI includes a `render.yaml` Blueprint that deploys:

1. **Render Static Site (`mergepilot-marketing`)**: Fast, CDN-hosted marketing landing page exported statically (`apps/marketing/out`).
2. **Render Web Service (`mergepilot-app`)**: Node.js dynamic server for the dashboard, GitHub OAuth, and AI intelligence suite (`apps/web`).
3. **Render PostgreSQL (`mergepilot-db`)**: Managed relational database with auto-generated credentials.

### Deploying with Render Blueprint:

1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** > **Blueprint**.
3. Select your repository. Render automatically reads `render.yaml` and sets up all 3 services.
4. Fill in the prompted secret environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GEMINI_API_KEY`
5. Update your GitHub OAuth Application Authorization callback URL to:
   `https://<your-web-service>.onrender.com/api/auth/callback/github`
6. Deploy! Render will build the static marketing site and launch the web service with database migrations automatically.

---

## 16. Security & Token Protection

- **Server-Only Credentials**: GitHub OAuth access tokens, Gemini API keys, and database connection strings are never exposed to client-side bundles or headers.
- **Session Protection**: All `/dashboard/*` routes and `/api/*` intelligence routes authenticate via server-side session cookies.
- **Strict Zod Boundary Validation**: Raw inputs from external GitHub APIs and AI model responses are validated using strict Zod schemas before persistence.
- **Rate Limit & Expiry Handling**: GitHub API rate limits (429) and expired sessions (401) are trapped and reported with clear reconnection instructions.

---

## License

MIT © MergePilot AI Team
