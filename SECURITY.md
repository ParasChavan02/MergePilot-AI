# Security Policy

At **MergePilot AI**, security is fundamental to everything we build. MergePilot AI interacts with sensitive developer workflows, including GitHub OAuth tokens, pull request metadata, code diffs, database records, and AI-driven analysis pipelines. We take vulnerabilities and data protection seriously.

This policy outlines how to report security issues, our response process, supported versions, and security practices for contributors.

---

## Supported Versions

Security fixes and patches are applied to the active development branch (`main`) and the latest stable release. Because MergePilot AI is actively evolving, earlier minor releases may not receive backported security patches.

| Version | Supported          | Status                                 |
| :------ | :----------------- | :------------------------------------- |
| 0.1.x   | :white_check_mark: | Currently active release (main branch) |
| < 0.1.0 | :x:                | Unsupported                            |

We strongly recommend always running the latest version from the `main` branch or pulling the latest official release.

---

## Reporting a Vulnerability

> [!CAUTION]
> **DO NOT** file public GitHub issues, discussions, or pull requests for suspected security vulnerabilities. Publicly disclosing an unpatched flaw puts active installations at risk.

If you believe you have discovered a security vulnerability in MergePilot AI, please disclose it responsibly by contacting the maintainers directly via email:

- **Email**: `chavanparas0201@gmail.com`
- **Subject**: `[SECURITY] MergePilot AI Vulnerability Report - <Brief Description>`

### What to Include in Your Report

To help us investigate, reproduce, and resolve the issue quickly, please provide as much information as possible:

1. **Description**: A clear summary of the vulnerability and its potential security impact.
2. **Affected Components**: Specific files, routes, or modules involved (e.g., `/api/analysis/[id]`, GitHub OAuth flow, Drizzle schema, or Gemini prompt construction).
3. **Steps to Reproduce**: A minimal, reproducible proof-of-concept (PoC) or step-by-step instructions.
4. **Environment**: Node.js version, browser (if client-side), operating system, and deployment target.
5. **Mitigation**: Any potential remediations, patches, or workarounds you have identified.

### What NOT to Include

- **Never include live production secrets**: Do not attach live GitHub OAuth client secrets, valid personal access tokens, production `DATABASE_URL` strings, or real user session cookies.
- **Use sanitized dummy data**: Demonstrate findings using local mock repositories, synthetic diffs, and local test credentials.

---

## Vulnerability Handling Process

Once a vulnerability report is submitted, maintainers follow this coordinated disclosure workflow:

1. **Acknowledgment**: We will review and acknowledge receipt of your report as soon as possible.
2. **Investigation & Triage**: Maintainers will attempt to reproduce the reported issue locally in an isolated test environment and assess its severity.
3. **Fix Development**: A patch will be authored, reviewed, and verified against our automated test suite (`pnpm test` and `pnpm check`).
4. **Release & Advisory**: Once verified, the patch is merged into the `main` branch and published in a new release. A security advisory will be published explaining the issue, remediation steps, and crediting the reporter (unless anonymity is requested).

---

## Architecture-Specific Threat Considerations

Contributors and security researchers should be mindful of the architectural boundaries unique to MergePilot AI:

### 1. GitHub OAuth and Access Tokens

MergePilot AI uses NextAuth / Auth.js with GitHub OAuth to authenticate developers and query repository metadata via Octokit.

- GitHub access tokens must **never** be transmitted to the client-side browser or exposed in frontend component state.
- Tokens must not be logged in server console outputs, error traces, or analytics payloads.
- Authentication callbacks must enforce strict CSRF protection and state parameter validation.

### 2. Untrusted Code Diffs & Prompt Injection

MergePilot AI processes arbitrary code diffs submitted by users or pulled from GitHub repositories.

- Code diffs must be treated as untrusted input.
- Diff content injected into Google Gemini prompts must be structured to prevent prompt injection or instructions that could alter system-level model constraints.
- Diffs exceeding model token budgets must be intelligently truncated to avoid denial-of-service or unexpected API cost spikes.

### 3. Database Security & Injection Prevention

- All database queries must be executed through **Drizzle ORM** using parameterized queries and type-safe query builders.
- Raw SQL strings (`sql\`...\``) should be used sparingly and must always parameterize dynamic variables rather than using string concatenation.
- User data must be strictly scoped to the authenticated user ID (`session.user.id`).

### 4. Input Validation & Schema Enforcement

- All incoming requests to route handlers under `app/api/` must validate query parameters and JSON payloads using **Zod** schemas.
- Model responses from Gemini must be parsed and validated against deterministic Zod schemas before being persisted to PostgreSQL or returned to the client.

### 5. Secrets Management

- Sensitive values (`DATABASE_URL`, `AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GEMINI_API_KEY`) must reside exclusively in `.env.local` or host environment variables.
- Never commit `.env` or `.env.local` files to version control. The `.gitignore` file enforces this rule.
- If you accidentally commit a credential to a branch or pull request, rotate it immediately in the respective provider dashboard (GitHub Developer Settings, Google AI Studio, database provider).

---

## Scope & Safe Harbor

We support responsible security research conducted in good faith. Research is considered authorized under safe harbor when it complies with the following guidelines:

### In Scope

- Vulnerabilities within the MergePilot AI codebase (Next.js application, API routes, authentication logic, database access layers, and risk evaluation engines).
- Identification of insecure dependencies, misconfigurations, or potential privilege escalation.

### Out of Scope

- Denial of Service (DoS or DDoS) attacks against hosting infrastructure or development servers.
- Social engineering, phishing, or physical attacks against maintainers or users.
- Automated vulnerability scanners that produce high-volume spam traffic without actionable proof-of-concept findings.
- Testing on third-party services (e.g., attacking GitHub's API or Google's Gemini infrastructure directly). Always test within your own local development environment.

---

## Related Documents

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contribution Guidelines](CONTRIBUTING.md)
- [Official Repository](https://github.com/ParasChavan02/MergePilot-AI)
