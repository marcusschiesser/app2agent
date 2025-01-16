const backend =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.app2agent.com";

// Secure fetch wrapper with extension authentication
export async function secureFetch(url: string, options: RequestInit = {}) {
  const extensionId = chrome.runtime.id;

  console.log("Chrome extension ID:", extensionId);

  const apiKey = localStorage.getItem("apiKey");

  const secureOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "X-Extension-Id": extensionId,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      ...(apiKey ? { "X-Api-Key": apiKey } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${backend}${url}`, secureOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}
