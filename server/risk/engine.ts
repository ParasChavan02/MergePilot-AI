import type { RiskLevel } from "@/server/ai/schemas";
import type { PullRequestContext } from "@/server/github/types";

export interface DeterministicRiskSignal {
  category:
    | "auth"
    | "security"
    | "database"
    | "payments"
    | "infrastructure"
    | "config"
    | "dependencies"
    | "scale"
    | "test_gap";
  severity: "critical" | "high" | "medium" | "low";
  weight: number;
  title: string;
  description: string;
  files: string[];
}

export interface DeterministicRiskAssessment {
  score: number;
  level: RiskLevel;
  signals: DeterministicRiskSignal[];
  hasTests: boolean;
  isLargePR: boolean;
  reasons: string[];
}

const CRITICAL_PATTERNS = [
  {
    pattern: /(auth|session|jwt|oauth|login|signup|password|credential)/i,
    category: "auth" as const,
    title: "Authentication or session logic modified",
    weight: 35
  },
  {
    pattern: /(crypto|security|permission|rbac|acl|cors|sanitize|csrf)/i,
    category: "security" as const,
    title: "Security, cryptography, or permission boundary altered",
    weight: 35
  },
  {
    pattern: /(migration|migrate|schema\.prisma|drizzle|migrations?\/|\.sql)/i,
    category: "database" as const,
    title: "Database schema or migration files modified",
    weight: 30
  },
  {
    pattern: /(stripe|payment|billing|checkout|subscription|invoice)/i,
    category: "payments" as const,
    title: "Payment or checkout processing logic changed",
    weight: 35
  },
  {
    pattern: /(docker|k8s|kubernetes|terraform|\.github\/workflows|helm)/i,
    category: "infrastructure" as const,
    title: "Infrastructure or CI/CD deployment pipeline modified",
    weight: 25
  },
  {
    pattern: /(\.env|config\/env|secrets)/i,
    category: "config" as const,
    title: "Environment variables or runtime secrets configuration altered",
    weight: 25
  }
];

const DESTRUCTIVE_DB_REGEX = /\b(drop\s+table|drop\s+column|truncate|delete\s+from|cascade)\b/i;

export function evaluateDeterministicRisk(
  context: PullRequestContext
): DeterministicRiskAssessment {
  const { changedFiles, statistics } = context;
  const signals: DeterministicRiskSignal[] = [];
  const reasons: string[] = [];

  let hasTests = false;
  let hasDocsOnly = true;

  for (const file of changedFiles) {
    const fn = file.filename.toLowerCase();

    // Check if test file
    if (
      fn.includes(".test.") ||
      fn.includes(".spec.") ||
      fn.includes("__tests__/") ||
      fn.includes("/test/")
    ) {
      hasTests = true;
      hasDocsOnly = false;
      continue;
    }

    // Check docs
    const isDoc =
      fn.endsWith(".md") || fn.endsWith(".txt") || fn.startsWith("docs/") || fn.includes("license");
    if (!isDoc) {
      hasDocsOnly = false;
    }

    // Check critical file patterns
    for (const rule of CRITICAL_PATTERNS) {
      if (rule.pattern.test(fn)) {
        const existing = signals.find((s) => s.category === rule.category);
        if (existing) {
          existing.files.push(file.filename);
        } else {
          signals.push({
            category: rule.category,
            severity: rule.weight >= 30 ? "high" : "medium",
            weight: rule.weight,
            title: rule.title,
            description: `Changes detected in ${file.filename}`,
            files: [file.filename]
          });
          reasons.push(`${rule.title} (${file.filename})`);
        }
      }
    }

    // Check patch for destructive DB statements
    if (file.patch && DESTRUCTIVE_DB_REGEX.test(file.patch)) {
      signals.push({
        category: "database",
        severity: "critical",
        weight: 40,
        title: "Potential destructive database operation detected",
        description: `Destructive DDL/DML keyword found in patch for ${file.filename}`,
        files: [file.filename]
      });
      reasons.push(`Destructive database statement detected in ${file.filename}`);
    }

    // Check dependencies
    if (
      fn === "package.json" ||
      fn === "pnpm-lock.yaml" ||
      fn === "yarn.lock" ||
      fn === "package-lock.json"
    ) {
      signals.push({
        category: "dependencies",
        severity: "medium",
        weight: 15,
        title: "Project dependencies updated",
        description: "Package manifest modified; potential supply-chain or version shift",
        files: [file.filename]
      });
      reasons.push("External dependencies modified in package manifest");
    }
  }

  // PR size risk
  const isLargePR =
    statistics.totalAdditions + statistics.totalDeletions > 600 ||
    statistics.totalChangedFiles > 25;
  if (isLargePR) {
    signals.push({
      category: "scale",
      severity: "medium",
      weight: 15,
      title: "Large pull request size",
      description: `Large PR footprint: ${statistics.totalChangedFiles} files, +${statistics.totalAdditions}/-${statistics.totalDeletions} lines`,
      files: []
    });
    reasons.push(
      `Large change footprint (${statistics.totalChangedFiles} files, ${statistics.totalAdditions + statistics.totalDeletions} lines changed)`
    );
  }

  // Missing test gap
  const hasCriticalChanges = signals.some(
    (s) => s.severity === "high" || s.severity === "critical"
  );
  if (hasCriticalChanges && !hasTests) {
    signals.push({
      category: "test_gap",
      severity: "high",
      weight: 20,
      title: "No test files modified alongside critical changes",
      description:
        "Critical security, authentication, or database code was updated without corresponding test updates.",
      files: []
    });
    reasons.push("Critical system areas modified with no accompanying automated tests detected");
  }

  // If docs only
  if (hasDocsOnly && changedFiles.length > 0) {
    return {
      score: 5,
      level: "low",
      signals: [],
      hasTests: false,
      isLargePR: false,
      reasons: ["Documentation and markdown files only; minimal operational risk"]
    };
  }

  // Calculate composite score
  const totalWeight = signals.reduce((acc, s) => acc + s.weight, 0);
  const baseline = 10;
  const rawScore = Math.min(Math.max(baseline + totalWeight, 5), 100);

  let level: RiskLevel = "low";
  if (rawScore >= 85 || signals.some((s) => s.severity === "critical")) {
    level = "critical";
  } else if (rawScore >= 55 || signals.some((s) => s.severity === "high")) {
    level = "high";
  } else if (rawScore >= 35 || signals.some((s) => s.severity === "medium")) {
    level = "medium";
  }

  return {
    score: rawScore,
    level,
    signals,
    hasTests,
    isLargePR,
    reasons:
      reasons.length > 0
        ? reasons
        : ["Standard application code modification with normal blast radius"]
  };
}

export function synthesizeRisk(
  deterministic: DeterministicRiskAssessment,
  aiRisk: { level: RiskLevel; score: number; reasons: string[] }
): { level: RiskLevel; score: number; reasons: string[] } {
  // Balanced 50/50 blend between deterministic structural code signals and AI contextual reasoning
  const blendedScore = Math.round(deterministic.score * 0.45 + aiRisk.score * 0.55);
  const finalScore = Math.min(Math.max(blendedScore, 5), 100);

  // If deterministic engine detected critical keywords or zero-test security change, floor the severity
  let finalLevel: RiskLevel;
  if (finalScore >= 80 || deterministic.signals.some((s) => s.severity === "critical")) {
    finalLevel = finalScore >= 90 ? "critical" : "high";
  } else if (finalScore >= 45 || deterministic.level === "medium" || aiRisk.level === "medium") {
    finalLevel = "medium";
  } else {
    finalLevel = "low";
  }

  // Deduplicate and combine unique reasons
  const combinedReasons = Array.from(new Set([...deterministic.reasons, ...aiRisk.reasons])).slice(
    0,
    8
  );

  return {
    level: finalLevel,
    score: finalScore,
    reasons: combinedReasons
  };
}
