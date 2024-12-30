import { Tool, SchemaType } from "@google/generative-ai";

export const handleWelcomeUser = async (args: { message: string }) => {
  return {
    text: `Welcome! I received your message: "${args.message}". How can I assist you today?`,
  };
};

export const welcomeToolConfig: Tool = {
  functionDeclarations: [
    {
      name: "welcomeUser",
      description: "Say welcome to the user with a personalized message",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          message: {
            type: SchemaType.STRING,
            description: "The user's message to respond to",
          },
        },
        required: ["message"],
      },
    },
  ],
};
