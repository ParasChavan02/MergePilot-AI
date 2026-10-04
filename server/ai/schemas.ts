import { z } from "zod";

export const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

export const breakingChangeItemSchema = z.object({
  area: z.string().describe("Component, API, schema, or system area affected"),
  reason: z.string().describe("Specific breaking change explanation"),
  potentialImpact: z.string().describe("Consequences or blast radius if merged")
});
export type BreakingChangeItem = z.infer<typeof breakingChangeItemSchema>;

export const breakingChangesSchema = z.object({
  detected: z.boolean(),
  severity: z.enum(["none", "low", "medium", "high", "critical"]).default("none"),
  items: z.array(breakingChangeItemSchema).default([])
});
export type BreakingChanges = z.infer<typeof breakingChangesSchema>;

export const testGapSchema = z.object({
  test: z.string().describe("Description of the missing or gap test"),
  reason: z.string().describe("Why this test is required based on PR changes"),
  suggestedVerification: z.string().describe("Concrete verification step or test case to write")
});
export type TestGap = z.infer<typeof testGapSchema>;

export const rawAiAnalysisSchema = z.object({
  summary: z
    .string()
    .describe("High-signal engineering summary explaining what changed and architectural intent"),
  risk: z.object({
    level: riskLevelSchema,
    score: z.number().min(0).max(100),
    reasons: z.array(z.string()).min(1)
  }),
  keyChanges: z.array(z.string()).min(1),
  breakingChanges: breakingChangesSchema,
  testGaps: z.array(testGapSchema).default([]),
  recommendations: z.array(z.string()).min(1),
  releaseNotes: z.string().describe("Clean markdown release notes draft ready for publishing")
});
export type RawAiAnalysis = z.infer<typeof rawAiAnalysisSchema>;

export const finalAnalysisResultSchema = z.object({
  summary: z.string(),
  risk: z.object({
    level: riskLevelSchema,
    score: z.number().min(0).max(100),
    reasons: z.array(z.string())
  }),
  keyChanges: z.array(z.string()),
  breakingChanges: breakingChangesSchema,
  testGaps: z.array(testGapSchema),
  recommendations: z.array(z.string()),
  releaseNotes: z.string(),
  metadata: z.object({
    analyzedAt: z.string(),
    model: z.string(),
    contextTruncated: z.boolean(),
    deterministicRiskSignals: z.array(z.string()).default([])
  })
});
export type FinalAnalysisResult = z.infer<typeof finalAnalysisResultSchema>;
