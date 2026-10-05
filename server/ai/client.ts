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
  env.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3.8-flash";

export async function generateStructuredAIResponse(prompt: string): Promise<string> {
  const ai = getGeminiModel();

  const response = await ai.models.generateContent({
    model: DEFAULT_GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response. Please try again.");
  }

  return response.text;
}
