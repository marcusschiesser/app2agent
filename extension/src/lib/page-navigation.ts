import { EventEmitter } from "eventemitter3";

export interface ElementSelector {
  type: "xpath";
  value: string;
}

export interface NavigationAction {
  type: "click";
  selector: ElementSelector;
  value?: string;
  description: string;
}

export interface NavigationPlan {
  targetPage: string;
  actions: NavigationAction[];
  fallback?: {
    url?: string;
    path?: string[];
  };
}

class ContentNavigationHelper extends EventEmitter {
  private async findElement(
    selector: ElementSelector,
  ): Promise<Element | null> {
    try {
      const xpathResult = document.evaluate(
        selector.value,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      if (xpathResult.singleNodeValue) {
        // Map the found element from cleaned DOM back to actual DOM
        const xpath = selector.value;
        const realElement = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue as Element;
        return realElement;
      }
    } catch (error) {
      console.error(`Error finding element with selector:`, selector, error);
    }
    return null;
  }

  private async executeAction(
    action: NavigationAction,
  ): Promise<{ success: boolean; error?: string }> {
    const element = await this.findElement(action.selector);
    if (!element) {
      console.error(`Element not found for action:`, action);
      return {
        success: false,
        error:
          "Element not found. Selector: " + JSON.stringify(action.selector),
      };
    }

    try {
      switch (action.type) {
        case "click":
          (element as HTMLElement).click();
          break;
        default:
          console.error("Unsupported action type:", action.type);
          break;
      }

      this.emit("action", {
        type: action.type,
        description: action.description,
        success: true,
      });

      return { success: true };
    } catch (error) {
      this.emit("action", {
        type: action.type,
        description: action.description,
        success: false,
        error: error instanceof Error ? error.message : JSON.stringify(error),
      });
      return {
        success: false,
        error: "Navigation failed, error: " + JSON.stringify(error),
      };
    }
  }

  async navigate(
    action: NavigationAction,
  ): Promise<{ success: boolean; error?: string }> {
    this.emit("start", { description: action.description });

    const { success, error } = await this.executeAction(action);
    if (!success) {
      return { success: false, error };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    this.emit("complete", { success: true });
    return { success: true };
  }
}

export const contentNavigationHelper = new ContentNavigationHelper();
