import {
  EnhancedGenerateContentResponse,
  GoogleGenerativeAI,
} from "@google/generative-ai";

export async function getLLMResponse(
  apiKey: string,
  prompt: string,
  model: string = "models/gemini-2.0-flash-exp",
): Promise<EnhancedGenerateContentResponse> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const client = genAI.getGenerativeModel({
    model: model,
  });
  const result = await client.generateContent(prompt);
  return result.response;
}
