import { SchemaType, Tool } from "@google/generative-ai";
import { cleanLLMResponse, getLLMResponse } from "../llm";
import { SiteConfig } from "@/hooks/use-config";
import { EVENT_TYPE, updateActionStatus } from "../events";
import { inputFormValue, getFormNode, cleanFormNode } from "../dom/form";

const MODEL = "models/gemini-1.5-flash";

type ExecutionState = "pending" | "in_progress" | "completed" | "failed";

interface FormField {
  key: string;
  value: string;
  type: string; // input type (text, email, password, etc.)
  required: boolean;
  currentValue?: string;
}

interface FormAction {
  field: FormField;
  value: string;
  status: ExecutionState;
  error?: string;
}

interface FormPrefillValue {
  xpath: string;
  value: string;
}

class FormPrefillWorkflow {
  private executionHistory: FormAction[] = [];
  private userRequest: string;
  private shouldStop: boolean = false;
  private siteConfig: SiteConfig;

  constructor(userRequest: string, siteConfig: SiteConfig) {
    this.userRequest = userRequest;
    this.siteConfig = siteConfig;
    this.setupStopListener();
  }

  private setupStopListener() {
    const handleStop = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data?.type === EVENT_TYPE.STOP_NAVIGATION
      ) {
        console.log("Received stop signal");
        this.shouldStop = true;
      }
    };

    window.addEventListener("message", handleStop);
  }

  private async predictFieldValue(
    formTree: string,
  ): Promise<FormPrefillValue[]> {
    const prompt = `
You are an browser agent who has responsibilities to analyze the website form using provided data: screenshot, form tree and user request.
Your task is to detect the which fields are missing and need to be filled with a value to fulfill the user request.
For the captcha field, you can detect the captcha value from the screenshot. Other wise, set the value to "None".

Here is the form tree:
${formTree}

Here is the user request:
${this.userRequest}

Using this context information could be helpful:
${this.siteConfig.manual}

Answer in the following JSON format:
[
  {
    "xpath": "xpath of the field",
    "value": "value to fill in"
  }
]
`;

    try {
      const response = await getLLMResponse(
        this.siteConfig.apiKey,
        prompt,
        true, // includeScreenshot
        MODEL,
      );
      const cleanedResponse = cleanLLMResponse(response.text());
      console.log("cleanedResponse", cleanedResponse);

      return JSON.parse(cleanedResponse) as FormPrefillValue[];
    } catch (error) {
      console.error("Error in predictFieldValue:", error);
      throw new Error("Failed to predict form values: " + error);
    }
  }

  private async detectFormTree(): Promise<string> {
    const formNode = getFormNode(window.document);
    const cleanedFormNode = cleanFormNode(formNode);
    const prompt = `
You are an browser agent who has responsibilities to analyze the website form. 
You are given a form html and your task is to extract the form tree.
The form tree should include the form label, form element type, current value, element xpath, form element options.
Important:
- Never guess a xpath, use the provided xpath of the element.

Example:
form(//*[@id="login"])
|-- input(//*[@id="username"], "example@gmail.com") Email address
|-- input(//*[@id="password"], "********") Password

form(//*[@id="search"])
|-- input(//*[@id="query"], "search term") Search term
|-- select(//*[@id="category"], "Latest") Search category
|   |-- option(//*[@id="category"]/option[1], "Latest") Latest
|   |-- option(//*[@id="category"]/option[2], "Top") Top
|-- textarea(//*[@id="description"], "") Description

Here is the form html:
${cleanedFormNode.outerHTML}

Now, answer what is the form tree:
`;

    const response = await getLLMResponse(
      this.siteConfig.apiKey,
      prompt,
      true, // includeScreenshot
      MODEL,
    );

    return response.text().trim();
  }

  async execute(): Promise<{ success: boolean; details: string }> {
    try {
      // Get form tree programmatically
      // const formTree = formatFormTree(nodes);

      // Use LLM to detect the form tree
      const formTree = await this.detectFormTree();
      console.log("formTree", formTree);

      const prefillValues = await this.predictFieldValue(formTree);
      updateActionStatus({
        message: "Filling form",
        status: "running",
      });
      // 2. Process each field
      for (const prefillValue of prefillValues) {
        if (this.shouldStop) {
          return {
            success: true,
            details: "Form filling stopped by user",
          };
        }
        inputFormValue(prefillValue.xpath, prefillValue.value);
      }
      updateActionStatus({
        message: "Submitting form",
        status: "running",
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // submitForm(prefillValues[0].xpath);
      return {
        success: true,
        details: "Form prefill completed",
      };
    } catch (error) {
      console.error("Form prefill workflow failed:", error);
      return {
        success: false,
        details:
          "Form prefill failed: " +
          (error instanceof Error ? error.message : "Unknown error"),
      };
    }
  }

  generateReport(): string {
    if (this.executionHistory.length === 0) {
      return "No form fields were filled.";
    }

    let report = `Request: ${this.userRequest}\n\nForm Fields:\n`;
    this.executionHistory.forEach((action, index) => {
      report += `${index + 1}. "${action.field.key}": ${action.status}`;
      if (action.error) report += ` (Error: ${action.error})`;
      report += `\n   Value: ${action.value}\n`;
    });

    return report;
  }
}

export const formPrefillWorkflow = async ({
  userRequest,
  siteConfig,
}: {
  userRequest: string;
  siteConfig: SiteConfig;
}) => {
  try {
    const workflow = new FormPrefillWorkflow(userRequest, siteConfig);
    const result = await workflow.execute();
    console.log("result", result);

    return {
      success: true,
      details: workflow.generateReport(),
    };
  } catch (error) {
    updateActionStatus({
      message: error instanceof Error ? error.message : "Form prefill failed",
      status: "failed",
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Form prefill execution failed",
    };
  }
};

export const formPrefillWorkflowConfig: Tool = {
  functionDeclarations: [
    {
      name: "formPrefillWorkflow",
      description:
        "Helps prefill forms on the website by analyzing the form structure and intelligently filling in appropriate values. Just provide the user request don't need to include the information.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          userRequest: {
            type: SchemaType.STRING,
            description:
              "The user's request to prefill a form. It should be a single sentence. Don't need to include the form values.",
          },
        },
        required: ["userRequest"],
      },
    },
  ],
};
