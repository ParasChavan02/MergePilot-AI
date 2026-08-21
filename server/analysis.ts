import { z } from "zod";

export const analysisSchema = z.object({
  riskScore: z.number().min(0).max(100),

  riskLevel: z.enum([
    "low",
    "medium",
    "high",
    "critical"
  ]),

  summary: z.string(),

  riskReasons: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
      severity: z.enum([
        "low",
        "medium",
        "high",
        "critical"
      ])
    })
  ),

  potentialImpact: z.array(
    z.object({
      area: z.string(),
      explanation: z.string()
    })
  ),

  testGaps: z.array(
    z.object({
      test: z.string(),
      reason: z.string()
    })
  ),

  mergeRecommendation: z.enum([
    "safe_to_merge",
    "review_required",
    "high_risk"
  ])
});

export type PRAnalysis = z.infer<typeof analysisSchema>;