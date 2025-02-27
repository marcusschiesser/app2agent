export function getBaseUrl() {
  return __NODE_ENV__ === "development"
    ? "http://localhost:3000"
    : "https://www.app2agent.com";
}

// Secure fetch wrapper with extension authentication
export async function secureFetch(url: string, options: RequestInit = {}) {
  const apiKey = localStorage.getItem("app2agent_apiKey");

  const secureOptions: RequestInit = {
    ...options,
    // credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      ...(apiKey ? { "X-Api-Key": apiKey } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${getBaseUrl()}${url}`, secureOptions);
  if (!response.ok && response.status !== 404) {
    if (response.status === 401) {
      throw new Error(
        "Invalid API key. Please check your settings and try again.",
      );
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}
