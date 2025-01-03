import { contentNavigationHelper } from "@/lib/page-navigation";

// Add A2A_EXECUTE_ACTION listener for content script
window.addEventListener("message", async (event) => {
  if (event.data?.type === "A2A_EXECUTE_ACTION") {
    try {
      console.log("Executing action: ", JSON.stringify(event.data.action));
      const result = await contentNavigationHelper.navigate(event.data.action);
      window.postMessage(
        {
          type: "A2A_EXECUTE_ACTION_RESULT",
          success: result.success,
          error: result.error,
          requestId: event.data.requestId,
        },
        window.location.origin,
      );
    } catch (error: unknown) {
      const errorMessage =
        "Got error when executing action: " +
        event.data.action.description +
        (error instanceof Error ? error.message : String(error));
      window.postMessage(
        {
          type: "A2A_EXECUTE_ACTION_RESULT",
          success: false,
          error: errorMessage,
          requestId: event.data.requestId,
        },
        window.location.origin,
      );
    }
  }
});

console.log("[page-navigation] Initialized and ready");
