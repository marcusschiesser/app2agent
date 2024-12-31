import { GoogleGenerativeAI } from "@google/generative-ai";

declare const __GEMINI_API_KEY__: string;

const genAI = new GoogleGenerativeAI(__GEMINI_API_KEY__);

const getContext = async (request: string, currentUrl: string) => {
  return `
To create a Service Page:

Click the Me icon at the top of your LinkedIn homepage.

Me icon at the top of your LinkedIn homepage.

Click the View Profile button.

Click the Add profile section button below your profile picture.

Click Add services.

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
  previousExecution: string,
): Promise<string[]> {
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.0-flash-exp",
  });

  const context = await getContext(request, currentUrl);

  const prompt = `You are an tester who using a browser to perform actions on a website.
  You are given a user request and the current page url.
  Based on the provided context, create an action plan to achieve the user's request.
  The action plan is a sequence of actions to be performed on the website described in sequence of actions.
  Examples:
  ###
  Current page: "https://linkedin.com"
  User request: "Post a job on LinkedIn"
  Previous execution: ""
  Your response in sequence of actions, each action is a single line:
  On the current page, click the "Login" button
  Click the "Login with Google account" button
  Navigate to the "Jobs" page
  Find and click a button to post a job
  ###

  ###
  Current page: "https://x.com"
  User request: "Change the display language to Spanish"
  Previous execution: "Clicked the 'Settings' button but failed at clicking the 'Languages' button"
  Your response in sequence of actions, each action is a single line:
  Find and click on the languages or accessibility menu
  Find and click on the language option
  Choose 'Spanish' from the list of languages
  ###

  Now, create an action plan for the following request:
  ###
  Current page: ${currentUrl}
  User request: ${request}
  Previous execution: ${previousExecution}
  Context: ${context}
  ###

  Your response in sequence of actions, each action is a single line:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.split("\n");
  } catch (error) {
    console.error("Failed to create action plan:", error);
    throw new Error("Failed to create action plan");
  }
}
