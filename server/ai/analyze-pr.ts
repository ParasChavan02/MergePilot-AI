import { generateStructuredAIResponse } from "./client";
import { buildPullRequestIntelligencePrompt } from "./prompts";
import {
  finalAnalysisResultSchema,
  rawAiAnalysisSchema,
  type FinalAnalysisResult
} from "./schemas";

import type { PullRequestContext } from "@/server/github/types";
import { evaluateDeterministicRisk, synthesizeRisk } from "@/server/risk/engine";

export async function analyzePullRequest(
  context: PullRequestContext
): Promise<FinalAnalysisResult> {
  // 1. Run deterministic risk analysis
  const deterministicAssessment = evaluateDeterministicRisk(context);

  // 2. Generate prompt and call Gemini AI
  const prompt = buildPullRequestIntelligencePrompt(context);
  const { text: rawResponse, modelUsed } = await generateStructuredAIResponse(prompt);

  // 3. Parse JSON safely
  let rawJson: unknown;
  try {
    rawJson = JSON.parse(rawResponse);
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", rawResponse, err);
    throw new Error("AI intelligence response could not be parsed as valid JSON");
  }

  // 4. Validate with Zod
  const parsedAi = rawAiAnalysisSchema.parse(rawJson);

  // 5. Combine deterministic structural signals with AI contextual reasoning
  const calibratedRisk = synthesizeRisk(deterministicAssessment, parsedAi.risk);

  // 6. Ensure deterministic test gaps or breaking change signals are reflected if any
  const combinedTestGaps = [...parsedAi.testGaps];
  if (
    !deterministicAssessment.hasTests &&
    deterministicAssessment.signals.some((s) => s.category === "test_gap") &&
    combinedTestGaps.length === 0
  ) {
    combinedTestGaps.push({
      test: "Automated regression tests for modified sensitive files",
      reason:
        "High-risk authentication, security, or database files were modified without accompanying test updates.",
      suggestedVerification:
        "Run end-to-end integration tests covering the affected authorization and data access flows."
    });
  }

  const result: FinalAnalysisResult = {
    summary: parsedAi.summary,
    risk: calibratedRisk,
    keyChanges: parsedAi.keyChanges,
    breakingChanges: parsedAi.breakingChanges,
    testGaps: combinedTestGaps,
    recommendations: parsedAi.recommendations,
    releaseNotes: parsedAi.releaseNotes,
    metadata: {
      analyzedAt: new Date().toISOString(),
      model: modelUsed,
      contextTruncated: context.contextTruncated,
      deterministicRiskSignals: deterministicAssessment.reasons
    }
  };

  return finalAnalysisResultSchema.parse(result);
}
