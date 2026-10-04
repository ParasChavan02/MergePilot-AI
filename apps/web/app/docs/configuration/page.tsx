import { DocsCallout } from "@/components/docs/docs-callout";
import { DocsCodeBlock } from "@/components/docs/docs-code-block";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc, type TocItem } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Configuration",
  description: "Configure environment variables and GitHub OAuth credentials for MergePilot AI."
};

const tocItems: TocItem[] = [
  { title: "Overview", id: "overview" },
  { title: "Environment Variables Reference", id: "env-reference" },
  { title: "Example .env.local", id: "example-env" },
  { title: "Schema Validation (Zod)", id: "validation" },
  { title: "GitHub OAuth App Setup", id: "oauth-setup" },
  { title: "Deployment Configuration", id: "deployment" }
];

export default function ConfigurationPage() {
  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1 space-y-10">
        {/* Header */}
        <div className="border-b border-border/60 pb-6">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Architecture & Setup
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Configuration
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            MergePilot requires five core environment variables for database connectivity, session
            security, GitHub OAuth, and Gemini AI inference.
          </p>
        </div>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Overview</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Environment variables are loaded and validated at application startup using{" "}
            <code>config/env.ts</code>. All secrets should be defined in a <code>.env.local</code>{" "}
            file in development or configured in your hosting provider&apos;s environment dashboard
            (e.g. Render, Vercel).
          </p>
        </section>

        {/* Environment Variables Reference */}
        <section id="env-reference" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Environment Variables Reference
          </h2>

          <div className="space-y-4">
            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  DATABASE_URL
                </span>
                <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                  Required
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                PostgreSQL database connection URI used by Drizzle ORM. Must support standard SSL
                connection strings (e.g. Neon, Supabase, Render PostgreSQL, or local Postgres).
              </p>
              <div className="font-mono text-[11px] text-muted-foreground">
                Example:{" "}
                <code>
                  postgresql://user:password@ep-sample-pooler.us-east-1.aws.neon.tech/mergepilot?sslmode=require
                </code>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">AUTH_SECRET</span>
                <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                  Required
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Cryptographic secret key used by Auth.js to sign and encrypt session JWT cookies.
                Generate using <code>openssl rand -hex 32</code>.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  GITHUB_CLIENT_ID
                </span>
                <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                  Required
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                The Client ID of your GitHub OAuth Application, created under GitHub Developer
                Settings.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  GITHUB_CLIENT_SECRET
                </span>
                <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                  Required
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                The Client Secret of your GitHub OAuth Application. Kept strictly on the server side
                to exchange OAuth authorization codes for access tokens.
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  GEMINI_API_KEY
                </span>
                <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                  Required for AI Analysis
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Google AI Studio API key used by <code>@google/genai</code> to call{" "}
                <code>gemini-2.5-flash</code> for pull request intelligence inference.
              </p>
            </div>
          </div>
        </section>

        {/* Example .env.local */}
        <section id="example-env" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Example .env.local
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Create a <code>.env.local</code> file in your workspace root with the following
            structure:
          </p>

          <DocsCodeBlock
            language="bash"
            filename=".env.local"
            code={`DATABASE_URL="postgresql://user:password@localhost:5432/mergepilot"
AUTH_SECRET="your_32_character_hex_auth_secret_here"
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
GEMINI_API_KEY="your_google_gemini_api_key"`}
          />
        </section>

        {/* Schema Validation */}
        <section id="validation" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Schema Validation (Zod)
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            MergePilot enforces environment variable integrity using Zod in{" "}
            <code>config/env.ts</code>:
          </p>

          <DocsCodeBlock
            language="typescript"
            filename="config/env.ts"
            code={`import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GEMINI_API_KEY: z.string().optional()
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY
});`}
          />

          <DocsCallout type="note" title="Runtime Guardrail">
            If any required variable is missing or blank, the application will throw a descriptive
            ZodError immediately on startup rather than failing unpredictably in production.
          </DocsCallout>
        </section>

        {/* GitHub OAuth App Setup */}
        <section id="oauth-setup" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            GitHub OAuth App Setup
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            To create your GitHub OAuth application:
          </p>
          <ol className="list-decimal space-y-2 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              Visit{" "}
              <strong>GitHub Settings → Developer Settings → OAuth Apps → New OAuth App</strong>.
            </li>
            <li>
              Set <strong>Application Name</strong> to <code>MergePilot AI</code>.
            </li>
            <li>
              Set <strong>Homepage URL</strong> to <code>http://localhost:3000</code> (or your
              production domain).
            </li>
            <li>
              Set <strong>Authorization callback URL</strong> to:
              <div className="mt-1 rounded-md bg-muted/60 p-2 font-mono text-[11px] text-foreground">
                http://localhost:3000/api/auth/callback/github
              </div>
            </li>
            <li>
              Generate a Client Secret and copy both the Client ID and Client Secret into your{" "}
              <code>.env.local</code>.
            </li>
          </ol>
        </section>

        {/* Deployment Configuration */}
        <section id="deployment" className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Deployment Configuration
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            When deploying to production (such as Render Web Service):
          </p>
          <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-foreground">
            <li>
              Update your GitHub OAuth application callback URL to:{" "}
              <code>https://your-app.onrender.com/api/auth/callback/github</code>.
            </li>
            <li>
              Set <code>AUTH_URL</code> or <code>NEXTAUTH_URL</code> to{" "}
              <code>https://your-app.onrender.com</code>.
            </li>
            <li>Set all 5 environment variables in your Render environment dashboard.</li>
          </ul>
        </section>

        <DocsPager currentPath="/docs/configuration" />
      </div>

      <DocsToc items={tocItems} />
    </div>
  );
}
