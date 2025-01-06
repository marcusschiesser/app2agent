export enum EVENT_TYPE {
  ACTION_STATUS = "A2A_ACTION_STATUS",
  STOP_NAVIGATION = "A2A_STOP_NAVIGATION",
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
