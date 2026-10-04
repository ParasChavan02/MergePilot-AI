export interface NavItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const docsNavigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs/introduction",
        description: "What MergePilot is, the problem it solves, and core positioning."
      },
      {
        title: "Quick Start",
        href: "/docs/quick-start",
        description: "5-step guide to connect GitHub and analyze your first pull request."
      },
      {
        title: "How It Works",
        href: "/docs/how-it-works",
        description: "The end-to-end pull request intelligence and risk analysis pipeline."
      }
    ]
  },
  {
    title: "Core Features",
    items: [
      {
        title: "AI Summary",
        href: "/docs/features/ai-summary",
        description: "High-signal architectural explanation of PR changes and intent."
      },
      {
        title: "Risk Analysis",
        href: "/docs/features/risk-analysis",
        description: "Deterministic signal scoring combined with AI contextual risk evaluation."
      },
      {
        title: "Test Gap Detection",
        href: "/docs/features/test-gaps",
        description: "Detection of untested critical changes and suggested verification steps."
      },
      {
        title: "Breaking Changes",
        href: "/docs/features/breaking-changes",
        description: "Identifying API contract shifts, schema alterations, and blast radius."
      },
      {
        title: "Release Notes",
        href: "/docs/features/release-notes",
        description: "Automatic change classification and markdown changelog generation."
      }
    ]
  },
  {
    title: "Architecture & Setup",
    items: [
      {
        title: "Architecture",
        href: "/docs/architecture",
        description: "Next.js App Router, Auth.js, Drizzle ORM, Octokit, and Gemini 2.5 Flash."
      },
      {
        title: "Configuration",
        href: "/docs/configuration",
        description: "Required environment variables and configuration validation."
      }
    ]
  },
  {
    title: "Reference",
    items: [
      {
        title: "API Reference",
        href: "/docs/api",
        description: "Complete documentation for all implemented backend API endpoints."
      },
      {
        title: "Changelog",
        href: "/docs/changelog",
        description: "Product updates, releases, and platform evolution log."
      },
      {
        title: "Roadmap",
        href: "/docs/roadmap",
        description: "Current implemented capabilities vs planned future features."
      }
    ]
  }
];

// Flat list for pagination
export const allDocsPages = docsNavigation.flatMap((section) => section.items);

export function getPrevNextPages(currentPath: string) {
  const currentIndex = allDocsPages.findIndex((page) => page.href === currentPath);
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? allDocsPages[currentIndex - 1] : null;
  const next = currentIndex < allDocsPages.length - 1 ? allDocsPages[currentIndex + 1] : null;

  return { prev, next };
}

export interface SearchEntry {
  title: string;
  href: string;
  section: string;
  description: string;
  keywords: string[];
}

export const searchIndex: SearchEntry[] = [
  {
    title: "Documentation Overview",
    href: "/docs",
    section: "Overview",
    description: "Welcome to MergePilot AI documentation portal.",
    keywords: ["docs", "overview", "home", "start", "guide"]
  },
  {
    title: "Introduction",
    href: "/docs/introduction",
    section: "Getting Started",
    description: "What MergePilot is, the problem it solves, and core positioning.",
    keywords: ["intro", "overview", "problem", "positioning", "workflow"]
  },
  {
    title: "Quick Start",
    href: "/docs/quick-start",
    section: "Getting Started",
    description: "5-step guide to connect GitHub and analyze your first pull request.",
    keywords: ["setup", "tutorial", "first pr", "login", "analyze"]
  },
  {
    title: "How It Works",
    href: "/docs/how-it-works",
    section: "Getting Started",
    description: "The end-to-end pull request intelligence and risk analysis pipeline.",
    keywords: ["pipeline", "flow", "diagram", "normalization", "engine"]
  },
  {
    title: "AI Summary",
    href: "/docs/features/ai-summary",
    section: "Core Features",
    description: "High-signal architectural explanation of PR changes and intent.",
    keywords: ["summary", "gemini", "intent", "explanation", "key changes"]
  },
  {
    title: "Risk Analysis",
    href: "/docs/features/risk-analysis",
    section: "Core Features",
    description: "Deterministic signal scoring combined with AI contextual risk evaluation.",
    keywords: ["risk", "score", "signals", "auth", "security", "database", "weights"]
  },
  {
    title: "Test Gap Detection",
    href: "/docs/features/test-gaps",
    section: "Core Features",
    description: "Detection of untested critical changes and suggested verification steps.",
    keywords: ["tests", "gaps", "verification", "coverage", "regression"]
  },
  {
    title: "Breaking Changes",
    href: "/docs/features/breaking-changes",
    section: "Core Features",
    description: "Identifying API contract shifts, schema alterations, and blast radius.",
    keywords: ["breaking", "contract", "blast radius", "impact", "severity"]
  },
  {
    title: "Release Notes",
    href: "/docs/features/release-notes",
    section: "Core Features",
    description: "Automatic change classification and markdown changelog generation.",
    keywords: ["release notes", "changelog", "markdown", "classification", "draft"]
  },
  {
    title: "Architecture",
    href: "/docs/architecture",
    section: "Architecture & Setup",
    description: "Next.js App Router, Auth.js, Drizzle ORM, Octokit, and Gemini 2.5 Flash.",
    keywords: ["architecture", "next.js", "drizzle", "gemini", "octokit", "postgres"]
  },
  {
    title: "Configuration",
    href: "/docs/configuration",
    section: "Architecture & Setup",
    description: "Required environment variables and configuration validation.",
    keywords: ["env", "environment", "database_url", "auth_secret", "gemini_api_key"]
  },
  {
    title: "API Reference",
    href: "/docs/api",
    section: "Reference",
    description: "Complete documentation for all implemented backend API endpoints.",
    keywords: ["api", "endpoints", "rest", "routes", "json", "headers"]
  },
  {
    title: "Changelog",
    href: "/docs/changelog",
    section: "Reference",
    description: "Product updates, releases, and platform evolution log.",
    keywords: ["changelog", "releases", "updates", "v0.1.0", "history"]
  },
  {
    title: "Roadmap",
    href: "/docs/roadmap",
    section: "Reference",
    description: "Current implemented capabilities vs planned future features.",
    keywords: ["roadmap", "current", "planned", "webhooks", "bot comments"]
  }
];
