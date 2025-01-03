import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * A function to create an navigation plan for a user's request based on the current page and the knowledge base.
 */
export async function createNavigationPlan(
  request: string,
  currentUrl: string,
  screenshot: string,
  executionHistory: string,
  apiKey: string,
  siteContext: string,
): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.0-flash-exp",
  });

  const prompt = `You are an tester who using a browser to perform actions on a website.
  You are given a user request, current page screenshot, url and execution history.
  Based on the provided context, create an action plan to achieve the user's request.
  The action plan is a sequence of actions to be performed on the website described in sequence of actions.
  Examples:
  ###
  Current page: "https://linkedin.com"
  User request: "Post a job on LinkedIn"
  Previous execution: ""
  The screenshot is shown that the user is not logged in yet.
  Your response in sequence of actions, each action is a single line:
  On the current page, click the "Login" button
  Click the "Login with Google account" button
  Navigate to the "Jobs" page
  Find and click a button to post a job
  ###


  ###
  Current page: "https://linkedin.com/jobs"
  User request: "Post a job on LinkedIn"
  Previous execution: ""
  The screenshot is shown that the user is already logged in and in the Home page.
  Your response in sequence of actions, each action is a single line:
  Navigate to the "Jobs" page
  Find and click a button to post a job
  ###

  Important:
  - Always use the provided information like screenshot, url and execution history to create or refine the action plan.
  - Never make up new information.
  - The plan should be in sequence of actions, each action is a single line and should reach the goal of the user's request.
  
  Now, create an action plan for the following request:
  ###
  Current page: ${currentUrl}
  User request: ${request}
  Execution history: ${executionHistory}
  Context: ${siteContext}
  ###

  Your response in sequence of actions, each action is a single line:
`;

  try {
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: screenshot,
                mimeType: "image/png",
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(request);
    const response = await result.response;
    const text = response.text();

    // Filter out empty steps and ensure each step is properly formatted
    return text
      .split("\n")
      .map((step) => step.trim())
      .filter((step) => step !== "");
  } catch (error) {
    console.error("Failed to create action plan:", error);
    throw new Error("Failed to create action plan");
  }
}
