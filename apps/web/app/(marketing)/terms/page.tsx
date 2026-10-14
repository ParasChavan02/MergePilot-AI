import type { Metadata } from "next";
import Link from "next/link";

import { LegalLayout } from "@/components/legal/legal-layout";
import type { LegalTocItem } from "@/components/legal/legal-toc";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the Terms of Service governing the use of the MergePilot AI platform, GitHub pull request intelligence features, and AI-assisted engineering tools."
};

const tocItems: LegalTocItem[] = [
  { id: "acceptance", number: "1.", title: "Acceptance of Terms" },
  { id: "service-description", number: "2.", title: "Description of the Service" },
  { id: "eligibility-and-accounts", number: "3.", title: "Eligibility & Accounts" },
  { id: "github-authorization", number: "4.", title: "GitHub Authorization & Rights" },
  { id: "acceptable-use", number: "5.", title: "Acceptable Use Policy" },
  { id: "ai-limitations", number: "6.", title: "AI Outputs & Limitations" },
  { id: "user-content", number: "7.", title: "User Content & IP" },
  { id: "third-party-services", number: "8.", title: "Third-Party Services" },
  { id: "pricing-and-plans", number: "9.", title: "Free Plan & Future Terms" },
  { id: "service-availability", number: "10.", title: "Availability & Modifications" },
  { id: "suspension-and-termination", number: "11.", title: "Suspension & Termination" },
  { id: "disclaimers", number: "12.", title: "Disclaimer of Warranties" },
  { id: "limitation-of-liability", number: "13.", title: "Limitation of Liability" },
  { id: "changes-to-terms", number: "14.", title: "Changes to These Terms" },
  { id: "governing-law", number: "15.", title: "Governing Law & Disputes" },
  { id: "contact", number: "16.", title: "Contact Information" }
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      tagline="Please read these Terms of Service carefully before connecting your GitHub account or using MergePilot AI."
      effectiveDate="October 14, 2026"
      lastUpdated="October 14, 2026"
      version="1.0"
      relatedDocument={{
        label: "Privacy Policy",
        href: "/privacy",
        description:
          "Learn how we handle your personal data, GitHub credentials, repository metadata, and AI processing."
      }}
      tocItems={tocItems}
    >
      {/* 1. Acceptance of Terms */}
      <section id="acceptance" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">01</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Acceptance of Terms
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          By accessing or using <strong className="text-foreground">MergePilot AI</strong>{" "}
          (&ldquo;MergePilot&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
          connecting your GitHub account, or browsing our website at{" "}
          <Link
            href="https://mergepilot-app.onrender.com"
            className="text-foreground underline underline-offset-2"
          >
            https://mergepilot-app.onrender.com
          </Link>
          , you (&ldquo;User&rdquo;, &ldquo;you&rdquo;, or &ldquo;your&rdquo;) agree to be bound by
          these Terms of Service (&ldquo;Terms&rdquo;) and our{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          If you are using MergePilot AI on behalf of an organization, company, or open-source team,
          you represent and warrant that you have the requisite authority to bind that entity to
          these Terms. If you do not agree with any part of these Terms, you must not use or connect
          to the service.
        </p>
      </section>

      {/* 2. Description of the Service */}
      <section id="service-description" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">02</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Description of the Service
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MergePilot AI is a developer productivity platform designed to help software engineering
          teams understand pull requests before merging. The service includes the following
          implemented capabilities:
        </p>
        <ul className="list-inside list-disc space-y-1 text-xs leading-relaxed text-muted-foreground">
          <li>
            <strong>GitHub Repository Integration:</strong> Connecting via GitHub OAuth to list
            repositories and pull requests to which your account has authorized access.
          </li>
          <li>
            <strong>Deterministic Signal Scanning:</strong> Automated rule-based inspection of
            sensitive files, migration files, security configurations, and lockfiles.
          </li>
          <li>
            <strong>AI-Powered Pull Request Intelligence:</strong> Generating executive summaries,
            risk scores, breaking change assessments, and verification suggestions via the Google
            Gemini API.
          </li>
          <li>
            <strong>Release Note Drafting:</strong> Automated synthesis of draft release notes and
            changelog summaries from pull request contents.
          </li>
          <li>
            <strong>Analysis Dashboard:</strong> Persisting and displaying historical PR analyses,
            risk metrics, and release notes in a unified web dashboard.
          </li>
        </ul>
      </section>

      {/* 3. Eligibility & Accounts */}
      <section id="eligibility-and-accounts" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">03</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Eligibility & Accounts
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          To use MergePilot AI, you must have an active GitHub account in good standing. You are
          solely responsible for:
        </p>
        <ul className="list-inside list-disc space-y-1 text-xs leading-relaxed text-muted-foreground">
          <li>Maintaining the security and confidentiality of your GitHub login credentials.</li>
          <li>
            All actions, analyses, and API requests initiated under your authenticated GitHub
            session.
          </li>
          <li>
            Promptly notifying us or revoking your GitHub OAuth tokens if you suspect unauthorized
            access to your account.
          </li>
        </ul>
      </section>

      {/* 4. GitHub Authorization & Rights */}
      <section id="github-authorization" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">04</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            GitHub Authorization & Repository Rights
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          When you authorize MergePilot AI with the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">repo</code> OAuth
          scope, you grant us permission to query repository metadata, pull request contents, commit
          history, and diffs on your behalf through the GitHub API.
        </p>
        <div className="rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">
            Your Representations Regarding Repositories:
          </p>
          <p className="mt-1">
            You represent and warrant that you own or have obtained all necessary licenses,
            permissions, and organizational approvals to grant MergePilot AI access to any
            repository you inspect. If you connect repositories belonging to an employer or
            third-party client, you are solely responsible for ensuring that doing so does not
            violate any confidentiality agreement, employment contract, or proprietary source code
            policy.
          </p>
        </div>
      </section>

      {/* 5. Acceptable Use Policy */}
      <section id="acceptable-use" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">05</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Acceptable Use Policy
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You agree not to misuse MergePilot AI or assist others in doing so. Specifically, you
          agree not to:
        </p>
        <ul className="list-inside list-disc space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <li>
            Attempt to gain unauthorized access to any accounts, databases, or systems connected to
            MergePilot AI.
          </li>
          <li>
            Bypass, probe, or tamper with authentication, rate-limiting, or security controls.
          </li>
          <li>
            Use the service to distribute malicious code, viruses, trojans, or exploit
            vulnerabilities.
          </li>
          <li>
            Engage in automated scraping, excessive crawling, denial-of-service (DoS) attacks, or
            activities that disrupt infrastructure.
          </li>
          <li>
            Submit source code or content that infringes upon any third party&apos;s intellectual
            property, privacy, or trade secret rights.
          </li>
          <li>
            Use MergePilot AI for any purpose that violates applicable local, national, or
            international laws or regulations.
          </li>
        </ul>
      </section>

      {/* 6. AI-Generated Output & Limitations */}
      <section id="ai-limitations" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">06</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            AI-Generated Outputs & Engineering Limitations
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">CRITICAL NOTICE REGARDING AI OUTPUTS:</strong>{" "}
          MergePilot AI utilizes artificial intelligence language models (Google Gemini API)
          combined with static heuristic rules to generate summaries, evaluate risk levels, propose
          test cases, and draft release notes.
        </p>

        <div className="rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <ul className="space-y-2">
            <li>
              <strong className="text-foreground">Assistive Tool Only:</strong> MergePilot AI is an
              advisory aid. It is <strong className="text-foreground">NOT</strong> a replacement for
              human code review, automated testing, static analysis, security audits, or engineering
              judgment.
            </li>
            <li>
              <strong className="text-foreground">No Warranty of Error-Free Detection:</strong> AI
              models are probabilistic and may produce incorrect, incomplete, or hallucinated
              findings. MergePilot AI does not warrant that it will detect every bug, security
              vulnerability, breaking change, or regressions.
            </li>
            <li>
              <strong className="text-foreground">Engineer Responsibility:</strong> You and your
              engineering team remain exclusively responsible for verifying all pull requests,
              testing code before deployment, ensuring system integrity, and deciding whether to
              merge code into your branches.
            </li>
          </ul>
        </div>
      </section>

      {/* 7. User Content & Intellectual Property */}
      <section id="user-content" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">07</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            User Content, Source Code & Intellectual Property
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Your Code Remains Yours:</strong> MergePilot AI does
          not claim any ownership rights over your repositories, source code, commits, pull
          requests, or any intellectual property contained therein.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong>Limited License to Operate the Service:</strong> By requesting an analysis of a
          repository or pull request, you grant MergePilot AI a limited, non-exclusive,
          royalty-free, revocable license strictly to access, transmit, and store your repository
          metadata and code diffs as required to execute deterministic risk scanning, query the
          Gemini API, and display results within your dashboard.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong>MergePilot Intellectual Property:</strong> MergePilot AI, its logo, brand assets,
          source code, deterministic risk rules, visual design, and documentation are the
          intellectual property of the project maintainer and open-source contributors under the MIT
          License.
        </p>
      </section>

      {/* 8. Third-Party Services */}
      <section id="third-party-services" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">08</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Third-Party Services & Dependencies
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MergePilot AI depends on external third-party services to operate:
        </p>
        <ul className="list-inside list-disc space-y-1 text-xs leading-relaxed text-muted-foreground">
          <li>
            <strong>GitHub Inc. / Microsoft:</strong> Provides OAuth identity services and
            repository REST APIs. Your use of GitHub is governed by GitHub&apos;s own Terms of
            Service.
          </li>
          <li>
            <strong>Google LLC (Gemini API):</strong> Provides language model inference. Data sent
            to Gemini is subject to Google&apos;s Generative AI terms.
          </li>
          <li>
            <strong>Render Services, Inc.:</strong> Provides server runtime hosting and PostgreSQL
            managed database infrastructure.
          </li>
        </ul>
        <p className="text-xs leading-relaxed text-muted-foreground">
          We are not liable for outages, API deprecations, rate limits, or service modifications
          imposed by these third-party providers.
        </p>
      </section>

      {/* 9. Free Plan & Future Terms */}
      <section id="pricing-and-plans" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">09</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Free Plan, Access & Future Commercial Terms
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          MergePilot AI is currently provided free of charge as an open-source platform and hosted
          developer utility. No credit card or billing details are required to use the existing
          capabilities.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          If paid subscription tiers, usage quotas, or enterprise features are introduced in the
          future, we will present transparent pricing and updated billing terms. You will never be
          charged without your explicit consent and enrollment in a paid plan.
        </p>
      </section>

      {/* 10. Availability & Modifications */}
      <section id="service-availability" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">10</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Service Availability & Modifications
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We continuously update and improve MergePilot AI. As a result, we may modify, add, or
          deprecate features from time to time.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          MergePilot AI is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
          We do not guarantee uninterrupted uptime, 24/7 availability, or specific service-level
          agreements (SLAs). The service may occasionally be unavailable due to routine maintenance,
          infrastructure upgrades, or upstream provider outages.
        </p>
      </section>

      {/* 11. Suspension & Termination */}
      <section id="suspension-and-termination" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">11</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Suspension & Termination
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You may terminate your relationship with MergePilot AI at any time by revoking GitHub
          OAuth permissions and ceasing use of the platform.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          We reserve the right to suspend or terminate your access to the service immediately,
          without prior notice, if we determine in good faith that you have breached these Terms,
          attempted to compromise system security, or engaged in fraudulent or abusive activities.
        </p>
      </section>

      {/* 12. Disclaimer of Warranties */}
      <section id="disclaimers" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">12</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Disclaimer of Warranties (&ldquo;AS IS&rdquo;)
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-medium uppercase text-foreground">
            TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW:
          </p>
          <p className="mt-2">
            MERGEPILOT AI AND ALL ASSOCIATED SERVICES, FEATURES, AND AI-GENERATED CONTENT ARE
            PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS, WITHOUT
            WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. WE EXPRESSLY
            DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT.
          </p>
          <p className="mt-2">
            WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, SECURE, ACCURATE, UNINTERRUPTED,
            OR FREE OF VIRUSES OR DEFECTS, OR THAT AI ANALYSIS RESULTS WILL ACCURATELY IDENTIFY ALL
            CODE ISSUES, INCIDENT RISKS, OR VULNERABILITIES.
          </p>
        </div>
      </section>

      {/* 13. Limitation of Liability */}
      <section id="limitation-of-liability" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">13</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Limitation of Liability
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-medium uppercase text-foreground">SUBJECT TO APPLICABLE LAW:</p>
          <p className="mt-2">
            IN NO EVENT SHALL MERGEPILOT AI, ITS MAINTAINER (PARAS CHAVAN), OR ITS CONTRIBUTORS BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE
            DAMAGES WHATSOEVER, INCLUDING LOSS OF PROFITS, DATA LOSS, PRODUCTION OUTAGES, FAILED
            DEPLOYMENTS, INCIDENTS, BUSINESS INTERRUPTION, OR REPUTATIONAL HARM ARISING OUT OF OR IN
            CONNECTION WITH YOUR ACCESS TO, USE OF, OR INABILITY TO USE THE SERVICE.
          </p>
          <p className="mt-2">
            IN JURISDICTIONS THAT DO NOT PERMIT THE EXCLUSION OR LIMITATION OF CERTAIN WARRANTIES OR
            LIABILITIES, OUR LIABILITY SHALL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW.
          </p>
        </div>
      </section>

      {/* 14. Changes to These Terms */}
      <section id="changes-to-terms" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">14</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Changes to These Terms
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We may update or revise these Terms from time to time. When modifications are made, the
          revised Terms will be posted to this page with an updated &ldquo;Last Updated&rdquo; date.
          Your continued access to or use of MergePilot AI following the posting of revised Terms
          constitutes your acceptance of the updated terms.
        </p>
      </section>

      {/* 15. Governing Law & Disputes */}
      <section id="governing-law" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">15</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Governing Law & Disputes
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          These Terms shall be governed by and construed in accordance with applicable general law,
          without giving effect to any principles of conflicts of law.
        </p>
        <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">Informal Dispute Resolution:</p>
          <p className="mt-1">
            Before initiating any formal legal claim, you agree to contact the project maintainer
            informally at{" "}
            <a
              href="mailto:chavanparas0201@gmail.com"
              className="font-mono text-foreground hover:underline"
            >
              chavanparas0201@gmail.com
            </a>{" "}
            to attempt to resolve the issue in good faith.
          </p>
        </div>
      </section>

      {/* 16. Contact Information */}
      <section id="contact" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <span className="font-mono text-sm font-semibold text-muted-foreground">16</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Contact Information
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          If you have any questions or inquiries regarding these Terms of Service, please reach out
          to:
        </p>
        <div className="rounded-xl border border-border bg-card p-5 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">MergePilot AI Project</p>
          <p className="mt-1">Maintainer: Paras Chavan</p>
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
            Repository:{" "}
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
            Issues & Feedback:{" "}
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
