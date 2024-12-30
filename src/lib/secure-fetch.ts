// Secure fetch wrapper with extension authentication
export async function secureFetch(url: string, options: RequestInit = {}) {
  const extensionId = chrome.runtime.id;

  console.log("Chrome extension ID:", extensionId);

  const secureOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "X-Extension-Id": extensionId,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, secureOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
}
