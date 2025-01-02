import { NavigationAction } from "@/lib/page-navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

declare const __GEMINI_API_KEY__: string;

const genAI = new GoogleGenerativeAI(__GEMINI_API_KEY__);

function cleanJsonResponse(text: string): string {
  // Remove markdown code block if present
  const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }
  // If no code block, try to extract just the JSON object
  const objectMatch = text.match(/\{[\s\S]*\}/);
  return objectMatch ? objectMatch[0] : text;
}

export async function createActionPlan(
  dom: string,
  actionDescription: string,
): Promise<NavigationAction> {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.0-flash-exp",
  });

  const prompt = `Given this DOM structure:
\`\`\`html
${dom}
\`\`\`

Analyze this action description: "${actionDescription}"
Find the most appropriate XPath selector that can be used to perform a click on that element for the action.
IMPORTANT:
- Don't make up a selector, only use the ones that are already in the DOM.
- If you can't find a selector, return an empty object.
- When using text match selector, you should use contains(., "text") instead of exact text match.
Return ONLY a JSON object in this exact format (no other text):
{
  "type": "click",
  "selector": { "type": "xpath", "value": "xpath selector value" },
  "description": "${actionDescription}",
  "value": "optional value for input/url actions"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const cleanedText = cleanJsonResponse(text);
    const action: NavigationAction = JSON.parse(cleanedText);
    return action;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    console.error("Raw response:", text);
    throw new Error("Failed to create navigation action from Gemini response");
  }
}
