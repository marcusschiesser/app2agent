const iframe = document.createElement("iframe");
iframe.setAttribute("hidden", "hidden");
iframe.setAttribute("id", "permissionsIFrame");
iframe.setAttribute("allow", "microphone");
iframe.src = chrome.runtime.getURL("/permission/index.html");
document.body.appendChild(iframe);
