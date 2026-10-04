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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
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
