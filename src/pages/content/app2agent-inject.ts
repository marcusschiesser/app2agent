window.addEventListener("message", async (event) => {
  if (event.data?.type === "A2A_CONSOLE_NAVIGATE") {
    try {
      console.log("Creating action plan for ", event.data.actionDescription);
      const dom = document.documentElement.outerHTML;
      const { success, result } = await chrome.runtime.sendMessage({
        type: "A2A_GET_ACTION_PLAN",
        dom,
        actionDescription: event.data.actionDescription,
      });
      if (!success) {
        console.error("Failed to get action plan", result);
        return;
      }
      console.log("Action plan created", JSON.stringify(result, null, 2));
      console.log("Triggering action for the plan");
      // Send message to navigation helper
      window.postMessage(
        {
          type: "A2A_EXECUTE_PLAN",
          plan: result,
        },
        window.location.origin,
      );
    } catch (error) {
      console.error("[app2agent-inject] Navigation failed:", error);
    }
  }

  if (event.data?.type === "A2A_EXECUTE_PLAN_RESULT") {
    console.log("[app2agent] Received execute plan result:", event.data);
    if (event.data.success) {
      console.log("[app2agent] Navigation successful");
    } else {
      console.error("[app2agent] Navigation failed:", event.data.error);
    }
    window.postMessage(
      {
        type: "A2A_CONSOLE_NAVIGATE_RESULT",
        success: event.data.success,
        error: event.data.error,
        requestId: event.data.requestId,
      },
      window.location.origin,
    );
  }
});

console.log("[app2agent-inject] Injected and ready to use");

// Make this a module
export {};
