import { GoogleGenAI } from "@google/genai";

import { env } from "@/config/env";

export function getGeminiModel() {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your environment to perform pull request analyses."
    );
  }

  return new GoogleGenAI({ apiKey });
}

export const DEFAULT_GEMINI_MODEL =
  env.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3.5-flash";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite"
];

function isHighDemandOrTransient(err: any): boolean {
  const msg = typeof err?.message === "string" ? err.message : "";
  const status = err?.status || err?.code;
  return (
    status === 503 ||
    status === "UNAVAILABLE" ||
    status === 429 ||
    msg.includes("503") ||
    msg.includes("high demand") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("RESOURCE_EXHAUSTED")
  );
}

function cleanErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message);
      if (parsed?.error?.message) {
        if (parsed.error.code === 503 || parsed.error.status === "UNAVAILABLE") {
          return "Google Gemini is currently experiencing temporary high demand. Please click Retry in a few moments.";
        }
        return parsed.error.message;
      }
    } catch {}
    return err.message;
  }
  return "AI intelligence generation failed. Please try again.";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateStructuredAIResponse(
  prompt: string
): Promise<{ text: string; modelUsed: string }> {
  const ai = getGeminiModel();
  const modelsToTry = [
    DEFAULT_GEMINI_MODEL,
    ...FALLBACK_MODELS.filter((m) => m !== DEFAULT_GEMINI_MODEL)
  ];

  let lastError: unknown = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });

        if (response.text) {
          return { text: response.text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini attempt ${attempt} with model ${model} failed:`, err?.message || err);

        // If high demand spike (503 / 429), back off briefly before retrying
        if (isHighDemandOrTransient(err) && attempt < 2) {
          await sleep(1500);
          continue;
        }

        // If model not found (404) or other error, break to next model in cascade
        break;
      }
    }
  }

  throw new Error(cleanErrorMessage(lastError));
}
