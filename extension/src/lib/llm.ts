import {
  EnhancedGenerateContentResponse,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { siteConfig } from "./site-config";

export async function getLLMResponse(
  prompt: string,
  model: string = "models/gemini-2.0-flash-exp",
): Promise<EnhancedGenerateContentResponse> {
  const apiKey = siteConfig.getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  const client = genAI.getGenerativeModel({
    model: model,
  });
  const result = await client.generateContent(prompt);
  return result.response;
}
