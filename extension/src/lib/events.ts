export enum EVENT_TYPE {
  ACTION_STATUS = "A2A_ACTION_STATUS", // For updating status messages
  STOP_NAVIGATION = "A2A_STOP_NAVIGATION", // For stopping the navigation tool
  CALL_START = "A2A_CALL_START", // When a call starts
  CALL_END = "A2A_CALL_END", // When a call ends
}

export type ActionEvent = {
  message: string;
  status: "running" | "completed" | "failed";
  data?: Map<string, string>;
};

/**
 * Show an action message to the popup window. This will override the previous message if any.
 * @param event - The action event to show
 */
export const updateActionStatus = (event: ActionEvent) => {
  window.postMessage(
    {
      type: EVENT_TYPE.ACTION_STATUS,
      ...event,
    },
    window.location.origin,
  );
};

export const stopNavigation = () => {
  window.postMessage(
    { type: EVENT_TYPE.STOP_NAVIGATION },
    window.location.origin,
  );
};

export const sendCallStartEvent = () => {
  window.postMessage(
    {
      type: EVENT_TYPE.CALL_START,
      timestamp: new Date().toISOString(),
    },
    window.location.origin,
  );
};

export const sendCallEndEvent = () => {
  window.postMessage(
    {
      type: EVENT_TYPE.CALL_END,
      timestamp: new Date().toISOString(),
    },
    window.location.origin,
  );
};
