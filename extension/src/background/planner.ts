import { GoogleGenerativeAI } from "@google/generative-ai";

declare const __GEMINI_API_KEY__: string;

const genAI = new GoogleGenerativeAI(__GEMINI_API_KEY__);

const getContext = async (request: string, currentUrl: string) => {
  return `
To create a Service Page:

Click on "Me" button on the top bar.

Click My Profile to go to your profile page.

Click the Add profile section button below your profile picture.

Click "Add services".

If this is your first time creating a Service Page, review the How it works information and click the Continue button.

Complete the Service Page set up information.
Click the Save button to make your Service Page viewable by members.
`;
};

/**
 * A function to create an navigation plan for a user's request based on the current page and the knowledge base.
 */
export async function createNavigationPlan(
  request: string,
  currentUrl: string,
  screenshot: string,
  executionHistory: string,
): Promise<string[]> {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.0-flash-exp",
  });

  const context = await getContext(request, currentUrl);

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
  
  Now, create an action plan for the following request:
  ###
  Current page: ${currentUrl}
  User request: ${request}
  Execution history: ${executionHistory}
  Context: ${context}
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
