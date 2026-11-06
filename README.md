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
- **Intelligent Analysis Caching**: Analyses are persisted in MongoDB Atlas; reopening an analyzed PR loads instantly without redundant AI API calls. Explicit re-analysis triggers fresh evaluation on demand.
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
     │        ├── AI Engine (Google Gemini 3.5 Flash via @google/genai)
     │        │        │
     │        │        ▼
     │        │   Zod Schema Validation & Risk Synthesis
     │        │
     │        └── Database Access Layer (Native MongoDB Driver)
     │                 │
     │                 ▼
     └─────────► MongoDB Atlas Cluster
```

---

## 6. Tech Stack

- **Framework**: Next.js 15 (App Router with Server Components, Route Handlers, and Server Actions)
- **Language**: TypeScript (Strict mode with `exactOptionalPropertyTypes`)
- **UI & Styling**: Tailwind CSS, shadcn/ui primitives, Magic UI components (`NumberTicker`, `SpotlightCard`, `BorderBeam`, `GridPattern`)
- **Authentication**: Auth.js / NextAuth v5 with GitHub OAuth provider
- **Database & Driver**: MongoDB Atlas with official native `mongodb` driver
- **AI Engine**: Google Gemini API (`@google/genai`) with Gemini 3.5 Flash
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
│   ├── web/                         # Authenticated dashboard and API server
│   │   ├── app/
│   │   │   ├── (auth)/login/        # GitHub sign-in page
│   │   │   ├── (dashboard)/dashboard/
│   │   │   │   ├── analyses/        # Historical analyses
│   │   │   │   ├── release-notes/   # Generated release notes
│   │   │   │   ├── repositories/    # Repository and pull request browser
│   │   │   │   └── settings/        # Settings and roadmap preview
│   │   │   ├── (marketing)/         # Marketing page served by the web app
│   │   │   ├── docs/                # Product and API documentation
│   │   │   └── api/                 # Auth, GitHub, analysis, and release-note APIs
│   │   ├── middleware.ts            # Route protection middleware
│   │   └── next.config.ts           # Next.js configuration
│   └── marketing/                   # Optional static marketing deployment
│       ├── app/                     # Standalone landing page
│       └── next.config.ts           # Static export configuration
├── components/
│   ├── auth/                        # Login components
│   ├── magicui/                     # Magic UI animations & effects
│   ├── providers/                   # Session, theme, and context providers
│   └── ui/                          # Badge, button, card, input, progress, tabs
├── config/                          # Environment, navigation, and site metadata
├── db/
│   └── models.ts                    # MongoDB document models & interfaces
├── features/                        # Domain UI features (repositories, pulls, etc.)
├── lib/                             # Shared utility functions and prompt builders
├── server/
│   ├── ai/                          # Gemini client, prompts, schemas, orchestrator
│   ├── auth.ts                      # Auth.js configuration & MongoDB adapter
│   ├── db.ts                        # MongoDB Atlas client connection pool
│   ├── github/                      # Modular GitHub client, repos, PRs, error handling
│   ├── risk/                        # Deterministic risk engine & synthesis
│   └── services/                    # Database persistence & caching services
├── tests/                           # Unit tests (Risk engine, Normalization, Schemas)
└── vitest.config.ts                 # Vitest test configuration
```

---

## 8. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.rb9bbij.mongodb.net/mergepilot?retryWrites=true&w=majority"
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.rb9bbij.mongodb.net/mergepilot?retryWrites=true&w=majority"

# NextAuth / Auth.js
AUTH_SECRET="your-32-character-secret-generated-via-openssl-rand-hex-32"
# In production, set AUTH_URL to your deployment domain:
# AUTH_URL="https://your-service.onrender.com"

# GitHub OAuth App
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"

# Google Gemini API (optional for deterministic-only/local development)
GEMINI_API_KEY="your_google_gemini_api_key"
```

`DATABASE_URL`, `AUTH_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET` are required by the server. `GEMINI_API_KEY` is optional, but AI-powered analysis and generated release notes require it.

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

## 10. MongoDB Atlas Setup

MergePilot AI uses MongoDB Atlas paired with the official native `mongodb` driver and `@auth/mongodb-adapter`.

### Initialize Collection Indexes

```bash
# Ensure all collections and unique indexes are created
pnpm db:init
```

---

## 11. Google Gemini AI Setup

1. Obtain an API key from Google AI Studio: [https://aistudio.google.com/](https://aistudio.google.com/).
2. Add the key to your `.env` as `GEMINI_API_KEY`.
3. MergePilot uses the high-performance `gemini-3.5-flash` model with JSON schema enforcement for sub-second, highly structured analysis.

---

## 12. Local Development

```bash
# 1. Clone repository
git clone https://github.com/ParasChavan02/MergePilot-AI.git
cd mergepilot-ai

# 2. Install workspace dependencies
pnpm install

# 3. Configure environment
# Create .env in the repository root and add the variables from section 8.

# 4. Generate and push database schema
pnpm db:generate
pnpm db:push

# 5. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. To run the standalone marketing app instead, use `pnpm dev:marketing` and open [http://localhost:3001](http://localhost:3001).

---

## 13. Testing

The test suite validates data normalization, error mapping, risk evaluation, and schema validation:

```bash
# Run test suite
pnpm test

# Run tests in watch mode
pnpm exec vitest
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

## 15. Security & Token Protection

- **Server-Only Credentials**: GitHub OAuth access tokens, Gemini API keys, and database connection strings are never exposed to client-side bundles or headers.
- **Session Protection**: All `/dashboard/*` routes and `/api/*` intelligence routes authenticate via server-side session cookies.
- **Strict Zod Boundary Validation**: Raw inputs from external GitHub APIs and AI model responses are validated using strict Zod schemas before persistence.
- **Rate Limit & Expiry Handling**: GitHub API rate limits (429) and expired sessions (401) are trapped and reported with clear reconnection instructions.

---

## License

MIT © MergePilot AI Team
