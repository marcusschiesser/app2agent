import { NavigationPlan } from "@/lib/page-navigation";
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
): Promise<NavigationPlan> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Given this DOM structure:
\`\`\`html
${dom}
\`\`\`

Analyze this action description: "${actionDescription}"
Find the most appropriate selectors for this action. Consider using multiple selector types for better reliability.
Return ONLY a JSON object in this exact format (no other text):
{
  "type": "click" | "input" | "scroll" | "url",
  "selectors": [
    { "type": "id" | "text" | "aria-label" | "role" | "class" | "xpath", "value": "selector value" }
  ],
  "value": "optional value for input/url actions"
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    // Sometimes Gemini returns a JSON object with a code block, sometimes not.
    // This function cleans the response to extract the JSON object.
    const cleanedText = cleanJsonResponse(text);
    const selectorInfo = JSON.parse(cleanedText);

    const navigationPlan: NavigationPlan = {
      targetPage: actionDescription,
      actions: [
        {
          type: selectorInfo.type,
          selectors: selectorInfo.selectors,
          description: actionDescription,
          value: selectorInfo.value,
        },
      ],
    };

    return navigationPlan;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    console.error("Raw response:", text);
    throw new Error("Failed to create navigation plan from Gemini response");
  }
}
