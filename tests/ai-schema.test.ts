import { describe, expect, it } from "vitest";

import { finalAnalysisResultSchema, rawAiAnalysisSchema } from "@/server/ai/schemas";

describe("AI Schema Validation with Zod", () => {
  it("validates well-formed raw AI output successfully", () => {
    const validRawOutput = {
      summary: "Refactored session cookie handling to support auto-refresh.",
      risk: {
        level: "high",
        score: 80,
        reasons: ["Authentication middleware changed", "Session cookie flags updated"]
      },
      keyChanges: ["Updated session token expiry logic", "Configured secure cookies for HTTPS"],
      breakingChanges: {
        detected: true,
        severity: "medium",
        items: [
          {
            area: "Session Token",
            reason: "Deprecated legacy field removed",
            potentialImpact: "Older clients will need to re-authenticate"
          }
        ]
      },
      testGaps: [
        {
          test: "Expired token redirect test",
          reason: "Cookie refresh branch was added without assertions",
          suggestedVerification: "Simulate expired cookie and assert 401 redirect"
        }
      ],
      recommendations: [
        "Verify in staging environment before merging",
        "Monitor 401 error rate in production"
      ],
      releaseNotes: "### Fixes\n- Resolved session token expiration bug"
    };

    const parsed = rawAiAnalysisSchema.parse(validRawOutput);
    expect(parsed.risk.score).toBe(80);
    expect(parsed.breakingChanges.detected).toBe(true);
    expect(parsed.testGaps).toHaveLength(1);
  });

  it("rejects invalid risk score outside 0-100", () => {
    const invalidOutput = {
      summary: "Summary",
      risk: {
        level: "high",
        score: 150, // Invalid: exceeds 100
        reasons: ["Reason"]
      },
      keyChanges: ["Change 1"],
      breakingChanges: { detected: false, severity: "none", items: [] },
      testGaps: [],
      recommendations: ["Rec 1"],
      releaseNotes: "Notes"
    };

    expect(() => rawAiAnalysisSchema.parse(invalidOutput)).toThrow();
  });

  it("validates finalAnalysisResultSchema with metadata", () => {
    const finalResult = {
      summary: "PR digest",
      risk: {
        level: "low",
        score: 15,
        reasons: ["Minor styling tweaks only"]
      },
      keyChanges: ["Updated button color"],
      breakingChanges: { detected: false, severity: "none", items: [] },
      testGaps: [],
      recommendations: ["Safe to merge"],
      releaseNotes: "### UI\n- Updated button styling",
      metadata: {
        analyzedAt: new Date().toISOString(),
        model: "gemini-2.5-flash",
        contextTruncated: false,
        deterministicRiskSignals: []
      }
    };

    const parsed = finalAnalysisResultSchema.parse(finalResult);
    expect(parsed.metadata.model).toBe("gemini-2.5-flash");
    expect(parsed.risk.level).toBe("low");
  });
});
