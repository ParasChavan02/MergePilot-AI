import type { Metadata } from "next";
import Link from "next/link";

import { LegalLayout } from "@/components/legal/legal-layout";
import type { LegalTocItem } from "@/components/legal/legal-toc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Understand how MergePilot AI collects, processes, stores, and protects your information, GitHub repository data, and pull request intelligence."
};

const tocItems: LegalTocItem[] = [
  { id: "introduction", number: "1.", title: "Introduction & Scope" },
  { id: "information-we-collect", number: "2.", title: "Information We Collect" },
  { id: "how-we-use-information", number: "3.", title: "How We Use Information" },
  { id: "github-permissions", number: "4.", title: "GitHub Permissions & Scopes" },
  { id: "ai-processing", number: "5.", title: "AI Processing & Google Gemini" },
  { id: "third-party-services", number: "6.", title: "Third-Party Sub-processors" },
  { id: "data-storage-and-retention", number: "7.", title: "Data Storage & Retention" },
  { id: "security", number: "8.", title: "Security Measures" },
  { id: "your-rights", number: "9.", title: "Your Choices & Deletion Rights" },
  { id: "international-transfers", number: "10.", title: "International Transfers" },
  { id: "childrens-privacy", number: "11.", title: "Children's Privacy" },
  { id: "policy-updates", number: "12.", title: "Policy Updates" },
  { id: "contact", number: "13.", title: "Contact Information" }
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      tagline="Learn how MergePilot AI collects, processes, and protects your personal data, GitHub credentials, and pull request intelligence."
      effectiveDate="October 14, 2026"
      lastUpdated="October 14, 2026"
      version="1.0"
      relatedDocument={{
        label: "Terms of Service",
        href: "/terms",
        description:
          "Review the governing terms, acceptable use policies, and limitations of liability for MergePilot AI."
      }}
      tocItems={tocItems}
    >
      {/* 1. Introduction */}
      <section id="introduction" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">01</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Introduction & Scope
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Welcome to <strong className="text-foreground">MergePilot AI</strong>{" "}
          (&ldquo;MergePilot&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), an
          open-source, AI-assisted GitHub pull request intelligence platform operated by maintainer
          Paras Chavan. MergePilot AI is accessible via{" "}
          <Link
            href="https://mergepilot-app.onrender.com"
            className="text-foreground underline underline-offset-2"
          >
            https://mergepilot-app.onrender.com
          </Link>{" "}
          and our GitHub repository at{" "}
          <a
            href="https://github.com/ParasChavan02/MergePilot-AI"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline underline-offset-2"
          >
            github.com/ParasChavan02/MergePilot-AI
          </a>
          .
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This Privacy Policy explains in clear, factual terms what data we collect, why we collect
          it, how it is processed and stored, what third-party services are involved, and what
          rights you have over your information. We do not sell your personal data or your source
          code to third parties.
        </p>
        <div className="rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">Summary for Developers:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              We authenticate you via GitHub OAuth and request permission to inspect repositories
              and pull requests you choose to analyze.
            </li>
            <li>
              Code diffs and PR metadata are sent to the Google Gemini API to generate risk scores,
              architectural summaries, and release notes.
            </li>
            <li>
              Analysis reports and authentication tokens are saved in our PostgreSQL database hosted
              on Render so you can view your analysis history.
            </li>
            <li>
              You can revoke access at any time through GitHub, and you can contact us to request
              full deletion of your database records.
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Information We Collect */}
      <section id="information-we-collect" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">02</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Information We Collect
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We collect only the categories of information necessary to deliver authenticated pull
          request intelligence:
        </p>

        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">
              A. GitHub Account & Profile Information
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              When you sign in using GitHub OAuth, NextAuth receives your public GitHub user
              profile:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>
                GitHub User ID and username (
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">login</code>)
              </li>
              <li>Primary email address associated with your GitHub account</li>
              <li>Display name and avatar URL</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">
              B. GitHub Authentication Credentials
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              To query the GitHub REST API on your behalf without requiring you to re-login on every
              request, we store the OAuth access token, token type, authorized scopes, and token
              expiration timestamps in our PostgreSQL{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">accounts</code>{" "}
              table.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">
              C. Repository & Pull Request Data
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              When you view repositories or analyze a pull request in your dashboard, MergePilot AI
              accesses repository metadata and diffs via GitHub Octokit REST APIs:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>
                Repository full name, description, default branch, and visibility (public or
                private)
              </li>
              <li>Pull request number, title, description body, author handle, and timestamps</li>
              <li>Git commit metadata (commit messages, authors, SHAs)</li>
              <li>List of modified filenames, addition/deletion counts, and patch diff chunks</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">
              D. Generated Intelligence Data
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              When analysis runs, MergePilot AI generates and stores structured engineering
              artifacts in our PostgreSQL database:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>Executive summaries of changes and key modification points</li>
              <li>
                Deterministic risk signals and synthesized risk scores (0–100,
                low/medium/high/critical)
              </li>
              <li>Detected breaking change items and potential production impacts</li>
              <li>Recommended test verification gaps and test suggestions</li>
              <li>Draft release notes generated from pull request contents</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">
              E. Server Diagnostics, Cookies & Storage
            </h3>
            <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-muted-foreground">
              <li>
                <strong>Session Cookies:</strong> NextAuth / Auth.js uses secure, HTTP-only session
                cookies (
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  authjs.session-token
                </code>
                ) to maintain signed-in sessions across page requests.
              </li>
              <li>
                <strong>Local Storage:</strong> Your browser stores a non-personal{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">theme</code>{" "}
                key (light or dark) and{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                  mergepilot_docs_sidebar_collapsed
                </code>{" "}
                preference.
              </li>
              <li>
                <strong>Hosting Logs:</strong> Standard HTTP request logs (IP address, user agent,
                request route, HTTP status code) are retained temporarily by Render for network
                security, DDoS mitigation, and uptime diagnostics.
              </li>
              <li>
                <strong>No Marketing Trackers:</strong> MergePilot AI does not use Google Analytics,
                advertising tracking pixels, or third-party behavioral trackers.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. How We Use Information */}
      <section id="how-we-use-information" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">03</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            How We Use Information
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We use the information we collect strictly to provide, maintain, and improve the
          MergePilot AI service:
        </p>
        <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="font-mono text-foreground">•</span>
            <span>
              <strong>Authentication:</strong> Verifying your identity with GitHub and maintaining
              your signed-in session.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-foreground">•</span>
            <span>
              <strong>Fetching Repositories & PRs:</strong> Displaying your repositories and open
              pull requests in the dashboard.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-foreground">•</span>
            <span>
              <strong>Deterministic & AI Analysis:</strong> Running static structural pattern rules
              and invoking Google Gemini to detect risks, test gaps, and breaking changes.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-foreground">•</span>
            <span>
              <strong>Analysis History & Release Notes:</strong> Storing past pull request analyses
              and release notes so you can review them at any time.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-foreground">•</span>
            <span>
              <strong>Reliability & Security:</strong> Identifying application errors, handling
              GitHub API rate limits, and securing endpoints against unauthorized access.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono text-foreground">•</span>
            <span>
              <strong>Support:</strong> Responding to questions or bug reports submitted via GitHub
              or email.
            </span>
          </li>
        </ul>
      </section>

      {/* 4. GitHub Permissions & Scopes */}
      <section id="github-permissions" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">04</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            GitHub Permissions & OAuth Scopes
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MergePilot AI connects to your GitHub account using the following OAuth authorization
          scopes:
        </p>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Why MergePilot Needs It</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="px-4 py-3 font-mono font-medium text-foreground">read:user</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Read public user profile information
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Retrieves your username and avatar for your dashboard account profile.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-medium text-foreground">user:email</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Access primary and verified email addresses
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Associates your MergePilot account with your verified GitHub email address.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono font-medium text-foreground">repo</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Full control of repositories (public & private)
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  GitHub OAuth does not provide a scope for read-only pull request diffs on private
                  repositories without the <code className="font-mono text-[11px]">repo</code>{" "}
                  scope. MergePilot uses this strictly to list repositories and read PR diffs that
                  you request.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
          <h4 className="font-semibold text-foreground">How to Revoke Access:</h4>
          <p className="mt-1">
            You can revoke MergePilot AI&apos;s authorization at any time by visiting your GitHub
            account settings:{" "}
            <a
              href="https://github.com/settings/applications"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              GitHub Settings &rarr; Applications &rarr; Authorized OAuth Apps
            </a>
            . Revoking authorization immediately prevents MergePilot AI from making any further API
            calls to GitHub on your behalf.
          </p>
        </div>
      </section>

      {/* 5. AI Processing & Google Gemini */}
      <section id="ai-processing" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">05</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            AI Processing & Google Gemini
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          When you request an analysis of a pull request, MergePilot AI prepares a structured prompt
          and transmits it to the <strong className="text-foreground">Google Gemini API</strong>{" "}
          using the official{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">@google/genai</code>{" "}
          SDK.
        </p>

        <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">
              What Information is Sent to Google Gemini?
            </h3>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Repository full name and branch references</li>
              <li>Pull request title, author login, and description</li>
              <li>Commit messages (up to 30 recent commits)</li>
              <li>
                File names and patch diffs (truncated to 45,000 characters if large to fit context
                limits)
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Google&apos;s Data Handling & Privacy Terms
            </h3>
            <p className="mt-1">
              Data transmitted to the Gemini API is processed by Google LLC in accordance with the{" "}
              <a
                href="https://ai.google.dev/terms"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-2"
              >
                Google Generative AI Additional Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-2"
              >
                Google Privacy Policy
              </a>
              . Depending on the tier and API key configuration in use (free versus paid Google
              Cloud project), Google may retain API prompts and outputs subject to their published
              terms. If your organization has strict prohibitions against submitting proprietary
              source code to external AI providers, you should review your organizational policies
              before analyzing sensitive repositories.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">
              AI Limitations & Advisory Nature
            </h3>
            <p className="mt-1">
              Generative AI outputs are probabilistic and advisory. While MergePilot incorporates
              deterministic rules for critical files (e.g. database schema migrations, auth logic,
              and lockfiles), AI-generated summaries and risk estimates may occasionally be
              incomplete or inaccurate. MergePilot AI is an assistive tool and does not substitute
              for human code review or automated CI/CD test suites.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Third-Party Sub-processors */}
      <section id="third-party-services" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">06</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Third-Party Sub-processors
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MergePilot AI relies on a minimal set of verified infrastructure and service providers:
        </p>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Data Processed</th>
                <th className="px-4 py-3">Privacy Information</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="px-4 py-3 font-semibold text-foreground">GitHub (Microsoft)</td>
                <td className="px-4 py-3 text-muted-foreground">
                  OAuth authentication, repository & pull request APIs
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Account profile, repository metadata, pull request diffs
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <a
                    href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-foreground"
                  >
                    GitHub Privacy Statement
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-foreground">Google LLC</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Gemini API generative AI reasoning
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  PR prompt contents (title, diff, commit messages)
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Google Privacy Policy
                  </a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-foreground">Render Services, Inc.</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Application hosting and managed PostgreSQL database
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  Database records, server access logs, application runtime
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <a
                    href="https://render.com/privacy"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Render Privacy Policy
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Data Storage & Retention */}
      <section id="data-storage-and-retention" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">07</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Data Storage & Retention
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          All persisted application data is stored in a managed PostgreSQL database instance hosted
          on Render.
        </p>
        <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          <p>
            <strong>What is Stored:</strong> Your user profile, OAuth tokens, registered repository
            records, pull request headers, generated analysis results, and release note drafts.
          </p>
          <p>
            <strong>Retention Schedule:</strong> Records remain stored while your account is active
            so you can navigate historical analyses and release notes across your repositories. A
            formalized automated data retention and scheduled pruning lifecycle is currently on the
            roadmap.
          </p>
          <p>
            <strong>Manual Purging:</strong> Users may request complete removal of their account
            data, authentication tokens, and analyses at any time by contacting the maintainer as
            described in Section 9.
          </p>
        </div>
      </section>

      {/* 8. Security Measures */}
      <section id="security" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">08</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Security Measures
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We maintain reasonable and verified technical controls designed to protect your data:
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <li>
            <strong>Encryption in Transit:</strong> All web traffic, API routes, and external API
            requests (to GitHub, Google, and PostgreSQL) are enforced over HTTPS with TLS.
          </li>
          <li>
            <strong>Secure Cookies:</strong> Session tokens are stored in HTTP-only, secure,
            SameSite cookies to protect against cross-site scripting (XSS) and cross-site request
            forgery (CSRF).
          </li>
          <li>
            <strong>Isolated Database Credentials:</strong> Database credentials, GitHub OAuth
            secrets, and Gemini API keys are injected exclusively via environment variables on the
            Render server runtime and never exposed in client bundles.
          </li>
          <li>
            <strong>Endpoint Authorization:</strong> Internal API routes verify active session
            tokens before returning or processing repository and pull request data.
          </li>
        </ul>
        <p className="text-xs text-muted-foreground">
          <em>Important Notice:</em> No internet transmission or electronic storage system is 100%
          secure. While we follow security best practices, we cannot guarantee absolute,
          invulnerable security.
        </p>
      </section>

      {/* 9. Your Choices & Deletion Rights */}
      <section id="your-rights" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">09</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Your Choices & Deletion Rights
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Depending on your location and applicable privacy laws (such as the EU GDPR or California
          Consumer Privacy Act), you may have the following rights regarding your information:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground">Disconnect & Revoke</h4>
            <p className="mt-1">
              You can disconnect MergePilot AI immediately by revoking the application in your
              GitHub Authorized OAuth Apps settings.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground">Sign Out</h4>
            <p className="mt-1">
              You can sign out of MergePilot AI at any time to destroy the local authentication
              session cookies in your browser.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground">Access & Export</h4>
            <p className="mt-1">
              You can request an export of your stored analyses, repository records, and account
              data by contacting us.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground">Data Deletion (Right to be Forgotten)</h4>
            <p className="mt-1">
              You can request permanent deletion of your user account, stored OAuth tokens, and all
              associated PR analyses.
            </p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          <em>Note on Self-Service Deletion:</em> An automated one-click &ldquo;Delete
          Account&rdquo; setting is currently under active development on our product roadmap. In
          the meantime, you can request full data deletion by emailing{" "}
          <a
            href="mailto:chavanparas0201@gmail.com"
            className="font-mono text-foreground underline underline-offset-2"
          >
            chavanparas0201@gmail.com
          </a>{" "}
          or opening a confidential request on our{" "}
          <a
            href="https://github.com/ParasChavan02/MergePilot-AI/issues"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline underline-offset-2"
          >
            GitHub repository
          </a>
          . We verify requests by confirming ownership of the associated GitHub account and process
          deletions promptly within 30 days.
        </p>
      </section>

      {/* 10. International Transfers */}
      <section id="international-transfers" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">10</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            International Data Transfers
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MergePilot AI is hosted on Render, which operates servers and data centers primarily
          located in the United States. Additionally, third-party services like GitHub and Google
          process information on servers located across multiple global regions. If you access
          MergePilot AI from outside the United States, your information will be transferred to,
          stored, and processed in jurisdictions where our hosting and API providers maintain
          infrastructure.
        </p>
      </section>

      {/* 11. Children's Privacy */}
      <section id="childrens-privacy" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">11</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Children&apos;s Privacy
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MergePilot AI is a software engineering productivity tool intended for developers and
          teams. The service is not directed to, marketed to, or designed for children under the age
          of 13 (or under 16 in the European Economic Area). We do not knowingly collect personal
          information from children. If you believe a child has provided us with personal
          information, please contact us so we can promptly delete the data.
        </p>
      </section>

      {/* 12. Policy Updates */}
      <section id="policy-updates" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">12</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Policy Updates
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We may update this Privacy Policy from time to time to reflect changes in our technology
          stack, third-party integrations, legal obligations, or product features. When changes are
          published, we will revise the &ldquo;Last Updated&rdquo; date at the top of this page. We
          encourage you to review this page periodically to stay informed about our data handling
          practices.
        </p>
      </section>

      {/* 13. Contact Information */}
      <section id="contact" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">13</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Contact Information
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          If you have questions, comments, or data requests regarding this Privacy Policy, please
          contact the maintainer:
        </p>
        <div className="rounded-xl border border-border bg-card p-5 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">MergePilot AI Maintainer</p>
          <p className="mt-1">Paras Chavan</p>
          <p className="mt-1">
            Email:{" "}
            <a
              href="mailto:chavanparas0201@gmail.com"
              className="font-mono text-foreground hover:underline"
            >
              chavanparas0201@gmail.com
            </a>
          </p>
          <p className="mt-1">
            Project Repository:{" "}
            <a
              href="https://github.com/ParasChavan02/MergePilot-AI"
              target="_blank"
              rel="noreferrer"
              className="text-foreground hover:underline"
            >
              https://github.com/ParasChavan02/MergePilot-AI
            </a>
          </p>
          <p className="mt-1">
            Issue Tracker:{" "}
            <a
              href="https://github.com/ParasChavan02/MergePilot-AI/issues"
              target="_blank"
              rel="noreferrer"
              className="text-foreground hover:underline"
            >
              https://github.com/ParasChavan02/MergePilot-AI/issues
            </a>
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
