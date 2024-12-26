import { EventEmitter } from "eventemitter3";

export interface ElementSelector {
  type: "id" | "text" | "aria-label" | "role" | "class" | "xpath";
  value: string;
}

export interface NavigationAction {
  type: "click" | "input" | "scroll" | "url";
  selectors: ElementSelector[];
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
    selectors: ElementSelector[],
  ): Promise<Element | null> {
    for (const selector of selectors) {
      try {
        switch (selector.type) {
          case "id": {
            const elementById = document.getElementById(selector.value);
            if (elementById) return elementById;
            break;
          }

          case "text": {
            const xpathText = `//*[contains(text(), "${selector.value}")]`;
            const textResult = document.evaluate(
              xpathText,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null,
            );
            if (textResult.singleNodeValue)
              return textResult.singleNodeValue as Element;
            break;
          }

          case "aria-label": {
            const elementByAriaLabel = document.querySelector(
              `[aria-label="${selector.value}"]`,
            );
            if (elementByAriaLabel) return elementByAriaLabel;
            break;
          }

          case "role": {
            const elementByRole = document.querySelector(
              `[role="${selector.value}"]`,
            );
            if (elementByRole) return elementByRole;
            break;
          }

          case "class": {
            const elementByClass = document.querySelector(`.${selector.value}`);
            if (elementByClass) return elementByClass;
            break;
          }

          case "xpath": {
            const xpathResult = document.evaluate(
              selector.value,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null,
            );
            if (xpathResult.singleNodeValue)
              return xpathResult.singleNodeValue as Element;
            break;
          }
        }
      } catch (error) {
        console.error(`Error finding element with selector:`, selector, error);
      }
    }
    return null;
  }

  private async executeAction(
    action: NavigationAction,
  ): Promise<{ success: boolean; error?: string }> {
    const element = await this.findElement(action.selectors);
    if (!element) {
      console.error(`Element not found for action:`, action);
      return { success: false, error: "Element not found. DOM: " + document };
    }

    try {
      switch (action.type) {
        case "click":
          (element as HTMLElement).click();
          break;

        case "input":
          if (action.value && element instanceof HTMLInputElement) {
            element.value = action.value;
            element.dispatchEvent(new Event("input", { bubbles: true }));
          }
          break;

        case "scroll":
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          break;

        case "url":
          window.location.href = action.value || "";
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
    plan: NavigationPlan,
  ): Promise<{ success: boolean; error?: string }> {
    this.emit("start", { targetPage: plan.targetPage });

    for (const action of plan.actions) {
      const { success, error } = await this.executeAction(action);
      if (!success) {
        if (plan.fallback) {
          this.emit("fallback", { type: "start" });

          if (plan.fallback.url) {
            window.location.href = plan.fallback.url;
            this.emit("fallback", { type: "url", url: plan.fallback.url });
            return { success: true };
          }

          if (plan.fallback.path) {
            for (const pathSegment of plan.fallback.path) {
              const found = await this.findElement([
                { type: "text", value: pathSegment },
              ]);
              if (found && found instanceof HTMLElement) {
                found.click();
                await new Promise((resolve) => setTimeout(resolve, 500));
                this.emit("fallback", { type: "path", segment: pathSegment });
              } else {
                this.emit("fallback", { type: "failed" });
                return {
                  success: false,
                  error: "Fallback path segment not found",
                };
              }
            }
            return { success: true };
          }
        }
        return { success: false, error };
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    this.emit("complete", { success: true });
    return { success: true };
  }
}

export const contentNavigationHelper = new ContentNavigationHelper();
