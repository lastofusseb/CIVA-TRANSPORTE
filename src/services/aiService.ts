import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Models in order of preference
const MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
];

export async function generateWithFallback(options: {
  contents: any[];
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}) {
  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType || "text/plain",
          temperature: options.temperature ?? 0.7,
        }
      });

      const text = response.text;
      if (text) return text;
    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All AI models failed");
}
