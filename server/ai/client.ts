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

export async function generateStructuredAIResponse(prompt: string): Promise<string> {
  const ai = getGeminiModel();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
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
