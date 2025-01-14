const iframe = document.createElement("iframe");
iframe.setAttribute("hidden", "hidden");
iframe.setAttribute("id", "permissionsIFrame");
iframe.setAttribute("allow", "microphone");
iframe.src = chrome.runtime.getURL("/permission/index.html");
document.body.appendChild(iframe);

// Forward messsages to the iframe
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "REQUEST_MICROPHONE_PERMISSION") {
    // Handle the microphone permission request
    iframe.contentWindow?.postMessage(
      { type: "REQUEST_MICROPHONE_PERMISSION" },
      "*",
    );
    return false;
  }
});
