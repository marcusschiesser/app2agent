import { SchemaType } from "@google/generative-ai";

import { Tool } from "@google/generative-ai";

type SitemapUrl = {
  loc: string;
};

export const siteMapRetrieverTool = async ({
  request,
  domain,
}: {
  request: string;
  domain: string;
}): Promise<SitemapUrl | null> => {
  try {
    // A fixed URL for job posting.
    return { loc: "https://www.linkedin.com/job-posting" };
  } catch (error) {
    console.error("Error in sitemap retriever:", error);
    return null;
  }
};

export const siteMapRetrieverToolConfig: Tool = {
  functionDeclarations: [
    {
      name: "siteMapRetriever",
      description:
        "Retrieve the best matching URL from the sitemap. Best for finding the URL of a page that we need to navigate to.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          request: {
            type: SchemaType.STRING,
            description:
              "The user's request for a feature/action on the current website, e.g. 'Update my service description'",
          },
          domain: {
            type: SchemaType.STRING,
            description:
              "The current domain of the website, e.g. 'linkedin.com', 'docs.llamaindex.ai'",
          },
        },
        required: ["request", "domain"],
      },
    },
  ],
};
