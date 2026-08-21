import { GoogleGenAI } from "@google/genai";

import { env } from "@/config/env";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
});

export async function analyzeWithGemini(prompt: string) {
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