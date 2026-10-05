import { GoogleGenAI } from "@google/genai";

import { env } from "@/config/env";

function getGeminiClient(): GoogleGenAI {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY to your environment variables."
    );
  }

  return new GoogleGenAI({
    apiKey
  });
}

export async function analyzeWithGemini(prompt: string): Promise<string> {
  const ai = getGeminiClient();
  const model = env.GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return response.text;
}
