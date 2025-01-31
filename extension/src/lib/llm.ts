import {
  EnhancedGenerateContentResponse,
  GoogleGenerativeAI,
  Part,
} from "@google/generative-ai";
import { takeScreenshot } from "./screenshot";

export async function getLLMResponse(
  apiKey: string,
  prompt: string,
  includeScreenshot: boolean = false,
  model: string = "models/gemini-2.0-flash-exp",
): Promise<EnhancedGenerateContentResponse> {
  const requestContents: (string | Part)[] = [{ text: prompt }];
  if (includeScreenshot) {
    const screenshot = await takeScreenshot();
    requestContents.push({
      inlineData: {
        data: screenshot.data,
        mimeType: screenshot.mimeType,
      },
    });
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const client = genAI.getGenerativeModel(
    {
      model: model,
    },
    {
      apiVersion: "v1beta",
    },
  );
  const result = await client.generateContent(requestContents);
  return result.response;
}

export function cleanLLMResponse(response: string): string {
  return response.replace(/```json\n|```/g, "");
}
